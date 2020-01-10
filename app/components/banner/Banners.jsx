import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Dropdown, Icon, Menu, message, Modal, Table} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'
import BannerUtils from "./BannerUtils";

export default class Banners extends React.Component {


    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys});
            if (selectedRowKeys.length !== 0) {
                this.setState({disabled: false});
            } else {
                this.setState({disabled: true});

            }
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            list: [],
            loading: false,
            selectedRowKeys: []
        };
    }

    componentDidMount() {
        U.setWXTitle('Banner管理');
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        App.api('adm/banner/banners', {bannerQo: JSON.stringify({})}).then((banners) => {
                this.setState({
                    list: banners, loading: false
                });
            }
        );
    };

    edit = (banner) => {
        BannerUtils.edit(banner, this.loadData);
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/banner/remove', {id}).then(() => {
                    message.success('删除成功');
                    let list = _this.state.list;
                    _this.setState({
                        list: U.array.remove(list, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    putSome = () => {
        let {selectedRowKeys} = this.state;

        App.api(`adm/banner/putsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量启用成功！");
                this.loadData();
            }
        });
    };

    outSome = () => {
        let {selectedRowKeys} = this.state;
        App.api(`adm/banner/outsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量停用成功！");
                this.loadData();
            }
        });
    };

    removesome = () => {
        let {selectedRowKeys} = this.state;
        selectedRowKeys.map((id) => {
            App.api(`adm/banner/remove`, {id})
        });
        message.success("批量删除成功！");
        this.loadData();
    };

    render() {
        let {type, list = [], loading, disabled} = this.state;
        let imgs = [];
        list.map((item) => {
            imgs.push(item.img);
        });
        return <div className="common-list">
            <BreadcrumbCustom first={CTYPE.link.info_banners.txt}/>
            <Card bordered={false}>

                <div style={{marginBottom: 15}}>
                    <Button type="primary" icon="file-add" onClick={() => {
                        this.edit({id: 0, type})
                    }}>新建Banner</Button>

                    <Button type="primary" icon="edit" disabled={disabled} onClick={() => {
                        this.putSome();
                    }}>批量启用</Button>

                    <Button type="primary" icon="edit" disabled={disabled} onClick={() => {
                        this.outSome();
                    }}>批量停用</Button>

                    <Button type="primary" icon="delete" disabled={disabled} onClick={() => {
                        this.removesome();
                    }}>批量删除</Button>
                </div>

                <Table

                    rowSelection={this.rowSelection}

                    columns={[{
                        title: '序号',
                        dataIndex: 'priority',
                        className: 'txt-center',
                        render: (col, row, i) => {
                            return <span>{(i + 1)}</span>
                        },
                    },
                        {
                            title: '图片',
                            dataIndex: 'img',
                            className: 'txt-center',
                            render: (img, item, index) => {
                                return <img key={img} className='banner-img' src={img + '@!120-120'} onClick={() => {
                                    Utils.common.showImgLightbox(imgs, index);
                                }}/>
                            }
                        }, {
                            title: '名称',
                            dataIndex: 'title',
                            className: 'txt-center',
                        },
                        {
                            title: '状态',
                            dataIndex: 'c-status',
                            className: 'txt-center',
                            render: (obj, c) => {
                                return <div className="state">
                                    {c.status === 1 ? <span className="important">启用</span> :
                                        <span className="disabled">停用</span>}
                                </div>
                            }
                        }, {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            render: (obj, banner, index) => {

                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(banner)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(banner.id, index)}>删除</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }]} rowKey={(record) => record.id} dataSource={list} loading={loading} pagination={false}/>
            </Card>

        </div>
    }
}