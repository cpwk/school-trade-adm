import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Input, Menu, message, Modal, Row, Table,} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import Utils from "../../common/Utils";
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import {Link} from "react-router-dom";
import UserUtils from "./UserUtils";

const InputSearch = Input.Search;

export default class User extends React.Component {

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            this.setState({selectedRowKeys})
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            selectedRowKeys: [],
            key: 'nick',
            list: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
            collapsed: false,
        }
    }

    componentDidMount() {
        U.setWXTitle('用户管理');
        this.loadData();
    }

    getQuery = () => {
        let {search, q, key} = this.state;
        let query = {};
        if (search === true) {
            if (U.str.isNotEmpty(q)) {
                if (key === 'nick') {
                    query = {nick: q};
                }
            }
        }
        return query;
    };

    loadData = () => {

        let {pagination = {}} = this.state;

        App.api('user/find_alluser', {
            userQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content, pagination,
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    remove = (id) => {
        Modal.confirm({
            title: `确认删除该用户?`,
            onOk: () => {
                if (Array.isArray(id)) {
                    for (let i = 0; i < id.length; i++) {
                        App.api('adm/user/delete_byid', {id: id[i]}).then(() => {
                            if (i === id.length - 1) {
                                message.success('删除成功');
                                this.loadData();
                            }
                        })
                    }
                } else {
                    App.api('adm/user/deletebyid', {id}).then(() => {
                        message.success('删除成功');
                        this.loadData();
                    })
                }
            },
            onCancel() {
            },
        });
    };

    doExport = () => {
        Utils.exportExcel.doExport('trainees', this.getQuery());
    };

    render() {

        let {list = [], pagination = {}, q} = this.state;

        return <div>

            <BreadcrumbCustom first={<Link to={CTYPE.link.info_user.path}>{CTYPE.link.info_user.txt}</Link>}/>

            <Card>

                <Row>

                    <Col span={12}>

                        <Button type="primary" icon="delete" onClick={() => {
                            this.remove();
                        }}>批量删除</Button>

                    </Col>

                    <Col span={12} style={{textAlign: 'right'}}>

                        <InputSearch
                            placeholder="输入用户昵称查询"
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
                        &nbsp;
                        &nbsp;
                        &nbsp;
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
                            title: '用户Id',
                            dataIndex: 'id',
                            className: 'txt-center'
                        },
                        {
                            title: '用户昵称',
                            dataIndex: 'nick',
                            className: 'txt-center'
                        },
                        {
                            title: '手机号',
                            dataIndex: 'mobile',
                            className: 'txt-center'
                        },
                        {
                            title: '邮箱',
                            dataIndex: 'email',
                            className: 'txt-center'
                        },
                        {
                            title: '注册时间',
                            dataIndex: 'createdAt',
                            className: 'txt-center',
                            render: (createdAt) => {
                                return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                            }
                        },
                        {
                            title: '操作',
                            dataIndex: 'option',
                            className: 'txt-center',
                            render: (obj, user) => {
                                let {id} = user;

                                return <Dropdown overlay={<Menu>

                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(id)}>删除<Icon type="delete" theme="twoTone"/></a>
                                    </Menu.Item>

                                    <Menu.Item key="3">
                                        <a onClick={() => UserUtils.userSessions(user.id)}>登录日志<Icon type="file-text"
                                                                                                     theme="twoTone"/></a>
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

                    dataSource={list}

                    pagination={{...pagination, ...CTYPE.commonPagination}}

                    onChange={this.handleTableChange}/>

            </Card>
        </div>
    }
}
