import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Avatar, Dropdown, Icon, Menu, Modal, Switch, Table} from 'antd';

import {U} from "../../common";

import '../../assets/css/merchant/merchant-detail.less'
import {CrossTitle} from "../../common/CommonComponent";
import MerchantUtils from "./MerchantUtils";
import ProductUtils from "../product/ProductUtils";

const id_div = 'div-dialog-merchant-detail';

export default class MerchantDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            merchantId: this.props.merchantId,
            index: this.props.index,
            syncMerchant: this.props.syncMerchant,

            merchant: {},

            productCategories: []
        };
    }

    componentDidMount() {
        this.loadMerchant();
        ProductUtils.loadProductCategories(this);
    }

    loadMerchant = (sync) => {
        let {merchantId} = this.state;
        App.api('oms/merchant/item', {id: merchantId}).then((merchant) => {
            if (sync) {
                this.doSyncMerchant(merchant);
            } else {
                this.setState({
                    merchant
                });
            }
        })
    };

    status = (merchantId, state) => {

        let {merchant = {}} = this.state;
        Modal.confirm({
            title: '提示',
            content: `确定${state === 1 ? '封禁' : '解封'}操作吗?`,
            onOk: () => {
                App.api('oms/merchant/merchant_status', {id: merchant.id, state: state === 1 ? 2 : 1}).then(() => {
                    merchant.state = state === 1 ? 2 : 1;
                    this.doSyncMerchant(merchant);
                });
            },
            onCancel: () => {
            },
        });

    };

    saveSetting = (set) => {
        let {id, setting} = this.state.merchant;
        App.api('/oms/merchant/update_setting', {
            merchantId: id,
            setting: JSON.stringify({
                ...setting,
                ...set
            })
        }).then(() => {
            this.setState({
                setting: {
                    ...setting,
                    ...set
                }
            })
        });
    };

    doSyncMerchant = (merchant) => {
        let {index, syncMerchant} = this.state;
        this.setState({merchant});
        syncMerchant && syncMerchant(merchant, index);
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {merchant = {}, productCategories = []} = this.state;

        let {id, logo, name, state, validThru, productCategorySequences = [], admins = [], setting = {}} = merchant;

        let {MERCHANT_RENEW, MERCHANT_EDIT} = Utils.adminPermissions;

        if (!id) {
            return <div/>
        }

        let remainingDays = U.date.daysDiff(validThru, new Date().getTime());

        let invalid = new Date().getTime() > new Date(validThru).getTime();

        return <Modal title="商户详情"
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={800} footer={null}
                      onCancel={this.close}>

            <div className='merchant-detail-page'>

                <div className="top">
                    <Avatar shape="square" icon="user" src={logo} size={100} className="avatar"/>
                    <div className='summary'>
                        <div className='line'>
                            <label>商户 ID</label>{id}</div>
                        <div className='line'>
                            <label>商户名称</label>{name}</div>
                        <div className='line'>
                            <label>商户状态</label>
                            <span className={state === 1 ? '' : 'warning'}>{state === 1 ? '正常' : '封禁'}</span>
                            {MERCHANT_EDIT && <a onClick={() => {
                                this.status(id, state)
                            }}>{state === 1 ? '封禁商户' : '解封商户'}</a>}
                        </div>
                        <div className='line'>
                            <label>到期时间</label><span
                            className={invalid ? 'warning' : ''}>{U.date.format(new Date(validThru), 'yyyy/MM/dd HH:mm')}</span>
                            {!invalid && <span style={{marginLeft: '20px'}}>剩余 {remainingDays} 天</span>}
                            {MERCHANT_RENEW && <a onClick={() => {
                                MerchantUtils.merchantRenew(merchant, this.loadMerchant);
                            }}>续期</a>}

                        </div>
                        <div className='line'>
                            <label>独立公众号</label><span>
                            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked={setting.selfWeixinMp}
                                    disabled={!MERCHANT_EDIT}
                                    onChange={(checked) => {
                                        this.saveSetting({selfWeixinMp: checked ? 1 : 0})
                                    }}/></span>
                        </div>
                    </div>
                </div>

                <CrossTitle title='经营范围'/>

                {ProductUtils.renderProductCategories(productCategories, productCategorySequences)}

                <CrossTitle title='管理员'/>

                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => i + 1
                    }, {
                        title: '手机号',
                        dataIndex: 'mobile',
                        className: 'txt-center'
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center'
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, admin, index) => {
                            return <Dropdown overlay={<Menu>
                                <Menu.Item key="1">
                                    <a onClick={() => MerchantUtils.merchantAdminPwd(admin)}>重置密码</a>
                                </Menu.Item>
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }

                    }]}
                    size='small'
                    rowKey={(item) => item.id}
                    dataSource={admins}
                    pagination={false}
                    loading={false}/>

                {/*<CrossTitle title='财务数据'/>*/}

            </div>

        </Modal>
    }
}
