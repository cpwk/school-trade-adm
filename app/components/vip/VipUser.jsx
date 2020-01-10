import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Menu, message, Modal, Row, Table, Tag} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import Utils from "../../common/Utils";
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import {Link} from "react-router-dom";
import VipUtils from "./VipUtils";

export default class VipUser extends React.Component {

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
            vipUsers: [],
            selectedRowKeys: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        U.setWXTitle('会员管理');
        this.loadData();
    }

    remove = (id) => {

        Modal.confirm({
            title: `确认解除该用户的会员资格?`,
            onOk: () => {
                App.api('adm/vip/expire', {id}).then(() => {
                    message.success('解除成功');
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    removesome = () => {
        let {selectedRowKeys} = this.state;
        Modal.confirm({
            title: `确认解除所选用户的会员资格?`,
            onOk: () => {
                selectedRowKeys.map((id) => {
                    App.api(`adm/vip/expire`, {id})
                });
                setTimeout(() => {
                    message.success("批量解除成功！");
                    this.loadData();
                }, 500)
            },
            onCancel() {
            },
        });
    };

    loadData = () => {

        let {pagination = {}} = this.state;

        App.api('/adm/vip/vipUsers', {
            vipUserQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                vipUsers: content,
                pagination,
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    render() {

        let {vipUsers = [], pagination = {}, disabled} = this.state;

        return <div>
            <BreadcrumbCustom first={<Link to={CTYPE.link.vip_user.path}>{CTYPE.link.vip_user.txt}</Link>}/>
            <Card>
                <Row>
                    <Col span={12}>
                        <Button type="primary" icon="delete" disabled={disabled} onClick={() => {
                            this.removesome();
                        }}>批量解除</Button>
                    </Col>
                </Row>
                <Table
                    rowSelection={this.rowSelection}
                    columns={[
                        {
                            title: '序号',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (col, row, i) => {
                                return <span>{(pagination.current - 1) * pagination.pageSize + (i + 1)}</span>
                            },
                        },
                        {
                            title: '头像',
                            dataIndex: 'user',
                            className: 'txt-center',
                            render: (user) => {
                                let {img = ''} = user;
                                return <img key={img} src={img + '@!120-120'}
                                            onClick={() => {
                                                Utils.common.showImgLightbox([img], 0);
                                            }}/>
                            }

                        },
                        {
                            title: '昵称',
                            dataIndex: 'user.nick',
                            className: 'txt-center'
                        },
                        {
                            title: '手机号',
                            dataIndex: 'user.mobile',
                            className: 'txt-center'
                        },
                        {
                            title: '邮箱',
                            dataIndex: 'user.email',
                            className: 'txt-center'
                        },
                        {
                            title: '等级',
                            dataIndex: 'vip.name',
                            className: 'txt-center'
                        },
                        {
                            title: '开通时间',
                            dataIndex: 'createAt',
                            className: 'txt-center',
                            render: (createdAt) => {
                                return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                            }
                        },
                        {
                            title: '到期时间',
                            dataIndex: 'expireAt',
                            className: 'txt-center',
                            render: (expireAt) => {
                                return U.date.format(new Date(expireAt), 'yyyy-MM-dd HH:mm')
                            }
                        },
                        {
                            title: '状态',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => {
                                let {expireAt} = item;
                                let now = new Date().getTime();
                                if (now < expireAt) {
                                    return <Tag color='green'>正常使用</Tag>
                                } else {
                                    return <Tag color='red'>已过期</Tag>

                                }
                            }
                        },
                        {
                            title: '操作',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => {

                                return <Dropdown overlay={<Menu>

                                    <Menu.Item key="1">
                                        <a onClick={() => VipUtils.vipRenew(item.id, this.loadData)}>续费<Icon
                                            type="money-collect"
                                            theme="twoTone"/></a>
                                    </Menu.Item>

                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(item.id)}>解除<Icon type="delete" theme="twoTone"/></a>
                                    </Menu.Item>

                                </Menu>} trigger={['click']}>

                                    <a className="ant-dropdown-link">
                                        选项 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }
                    ]}
                    rowKey={(item) => item.id}
                    dataSource={vipUsers}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}/>
            </Card>
        </div>
    }
}
