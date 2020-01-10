import React from 'react';
import {Button, Card, Col, Dropdown, Icon, Menu, message, Modal, Row, Table} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import Utils from "../../common/Utils";
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import {Link} from "react-router-dom";

class Comment extends React.Component {

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
            comments: [],
            selectedRowKeys: [],
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 1,
                total: 0,
            },
        }
    }

    componentDidMount() {
        U.setWXTitle('评论管理');
        this.loadData();
    }

    remove = (id) => {

        Modal.confirm({
            title: `确认删除该评论?`,
            onOk: () => {
                App.api('adm/comment/remove', {id}).then(() => {
                    message.success('删除成功');
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
            title: `确认删除所选评论?`,
            onOk: () => {
                selectedRowKeys.map((id) => {
                    App.api(`adm/comment/remove`, {id})
                });
                setTimeout(() => {
                    message.success("批量删除成功！");
                    this.loadData();
                }, 500)
            },
            onCancel() {
            },
        });
    };

    loadData = () => {

        let {pagination = {}} = this.state;

        App.api('/adm/comment/comments', {
            commentQo: JSON.stringify({
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                comments: content,
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

        let {comments = [], pagination = {}, disabled} = this.state;

        return <div>
            <BreadcrumbCustom first={<Link to={CTYPE.link.comment.path}>{CTYPE.link.comment.txt}</Link>}/>
            <Card>
                <Row>
                    <Col span={12}>
                        <Button type="primary" icon="delete" disabled={disabled} onClick={() => {
                            this.removesome();
                        }}>批量删除</Button>
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
                            title: '评论图片',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => {
                                let {content} = item;
                                let {img} = content;
                                return <img key={img[0]} src={img[0] + '@!120-120'}
                                            onClick={() => {
                                                Utils.common.showImgLightbox([img], 0);
                                            }}/>
                            }

                        },

                        {
                            title: '评论内容',
                            dataIndex: 'content.commentTxt',
                            className: 'txt-center',

                        },
                        {
                            title: '评论时间',
                            dataIndex: 'createAt',
                            className: 'txt-center',
                            render: (createdAt) => {
                                return U.date.format(new Date(createdAt), 'yyyy-MM-dd HH:mm')
                            }
                        },
                        {
                            title: '操作',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => {
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(item.id)}>删除<Icon type="delete" theme="twoTone"/></a>
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
                    dataSource={comments}
                    pagination={{...pagination, ...CTYPE.commonPagination}}
                    onChange={this.handleTableChange}/>
            </Card>
        </div>
    }
}

export default Comment;