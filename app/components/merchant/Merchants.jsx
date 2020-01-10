import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Input, Menu, Row, Select, Table} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U, Utils} from "../../common";
import MerchantUtils from "../merchant/MerchantUtils";

const InputSearch = Input.Search;
const Option = Select.Option;
const MenuItem = Menu.Item;

export default class Merchants extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            q: '',
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: MerchantUtils.getMerchantCurrentPage(),
                total: 0,
            },
            loading: false
        }
    }

    componentDidMount() {
        U.setWXTitle('店铺管理');
        this.loadData();
    }

    getQuery = () => {
        let {state, search, q = []} = this.state;

        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                query = {name: q};
            }
        }
        query.state = state;
        return query;
    };

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        App.api('oms/merchant/items', {
            merchantQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
                loading: false
            });
            MerchantUtils.setMerchantCurrentPage(pagination.current);
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    edit = merchant => {
        App.go(`/app/merchant/merchant-edit/${merchant.id}`)
    };

    syncMerchant = (merchant, index) => {
        let {list = []} = this.state;
        list[index] = merchant;
        this.setState({list});
    };

    render() {

        let {list = [], loading, pagination = {}, q} = this.state;

        let {MERCHANT_EDIT} = Utils.adminPermissions;

        let imgs = [];
        list.map((item) => {
            imgs.push(item.logo);
        });

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.merchant_merchants.txt}/>

            <Card>
                <Row>
                    <Col span={10}>
                        <div style={{marginBottom: '10px', height: '30px'}}>
                            {MERCHANT_EDIT && <Button type="primary" icon="plus-circle" onClick={() => {
                                this.edit({id: 0})
                            }}>创建商户</Button>}
                        </div>
                    </Col>
                    <Col span={14} style={{textAlign: 'right'}}>
                        <Select onSelect={(state) => {
                            this.setState({state}, () => this.loadData());
                        }} defaultValue={0} style={{width: 80}}>
                            <Option value={0}>状态</Option>
                            <Option value={1}>正常</Option>
                            <Option value={2}>禁用</Option>
                            <Option value={3}>欠费</Option>
                        </Select>
                        &nbsp;
                        <InputSearch
                            placeholder="输入名称查询"
                            style={{width: 200}}
                            value={q}
                            onChange={(e) => {
                                this.setState({q: e.target.value});
                            }}
                            onSearch={(v) => {
                                this.setState({
                                    q: v, search: true, pagination: {
                                        ...pagination,
                                        current: 1
                                    }
                                }, () => {
                                    this.loadData()
                                });
                            }}/>
                    </Col>
                </Row>
                <div className='clearfix-h20'/>
                <Table
                    columns={[{
                        title: '序号',
                        dataIndex: 'id',
                        className: 'txt-center',
                        render: (col, row, i) => {
                            return <span>{(pagination.current - 1) * pagination.pageSize + (i + 1)}</span>
                        },
                    }, {
                        title: 'LOGO',
                        dataIndex: 'logo',
                        className: 'txt-center ',
                        render: (logo, item, index) => {
                            return <img key={index} className='square-logo' src={logo + '@!120-120'} onClick={() => {
                                Utils.common.showImgLightbox(imgs, index);
                            }}/>
                        }
                    }, {
                        title: '名称',
                        dataIndex: 'name',
                        className: 'txt-center',
                        render: (name, merchant, index) => {
                            return <a
                                onClick={() => MerchantUtils.merchantDetail(merchant.id, index, this.syncMerchant)}>{name}</a>
                        }
                    }, {
                        title: '套餐期限',
                        dataIndex: 'validThru',
                        className: 'txt-center',
                        render: (validThru) => {
                            let invalid = new Date().getTime() > new Date(validThru).getTime();
                            return <span
                                style={invalid ? {color: '#ff0000'} : null}>{U.date.format(new Date(validThru), 'yyyy-MM-dd HH:mm')}</span>
                        }
                    }, {
                        title: '状态',
                        dataIndex: 'state',
                        className: 'txt-center',
                        render: (state) => {
                            switch (state) {
                                case 1:
                                    return '正常';
                                case 2:
                                    return '禁用';
                                case 3:
                                    return '欠费';
                            }
                        }
                    }, {
                        title: '创建时间',
                        dataIndex: 'createdAt',
                        className: 'txt-center',
                        render: (createdAt) => {
                            return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                        }
                    }, {
                        title: '操作',
                        dataIndex: 'option',
                        className: 'txt-center',
                        render: (obj, merchant, index) => {
                            return <Dropdown overlay={<Menu>
                                {MERCHANT_EDIT && <Menu.Item key="1">
                                    <a onClick={() => this.edit(merchant)}>编辑</a>
                                </Menu.Item>}
                                <MenuItem key="3">
                                    <a onClick={() => MerchantUtils.merchantDetail(merchant.id, index, this.syncMerchant)}>账号详情</a>
                                </MenuItem>
                                {MERCHANT_EDIT && <MenuItem key="4">
                                    <a onClick={() => {
                                        MerchantUtils.merchantAdminAdd(merchant);
                                    }}>新增商户管理员</a>
                                </MenuItem>}
                            </Menu>} trigger={['click']}>
                                <a className="ant-dropdown-link">
                                    操作 <Icon type="down"/>
                                </a>
                            </Dropdown>
                        }

                    }]}
                    rowKey={(item) => item.id}
                    dataSource={list}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    loading={loading} onChange={this.handleTableChange}/>
            </Card>
        </div>
    }
}
