import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {
    Badge,
    Button,
    Card,
    Col,
    Drawer,
    Dropdown,
    Icon,
    Input,
    Menu,
    message,
    Modal,
    Row,
    Table,
    Tag,
    TreeSelect
} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'
import ProductUtils from "./ProductUtils";

const InputSearch = Input.Search;
const {TreeNode} = TreeSelect;

export default class Products extends React.Component {

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
            items: {},
            visible: false,
            q: '',
            key: 'title',
            products: [],
            loading: false,
            selectedRowKeys: [],
            pagination: {pageSize: CTYPE.pagination.pageSize, current: ProductUtils.getCurrentPage(), total: 0},
            sorts: [],
            codes: []
        };
    }

    componentDidMount() {
        U.setWXTitle('商品管理');
        this.loadData();
    }

    getQuery = () => {
        let {codes = [], q, key} = this.state;
        let query = {};
        if (U.str.isNotEmpty(q)) {
            if (key === 'title') {
                query = {title: q};
            }
        }
        query.codes = codes;
        return query;
    };

    loadData = () => {
        let {pagination = {}} = this.state;
        this.setState({loading: true});
        Utils.nProgress.start();
        App.api('adm/product/products', {
            productQo: JSON.stringify({
                ...this.getQuery(),
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((product) => {
                let {content = []} = product;
                let pagination = Utils.pager.convert2Pagination(product);
                Utils.nProgress.done();
                this.setState({
                    products: content,
                    pagination,
                    loading: false
                });
            }
        );
        App.api('adm/sort/sorts', {sortQo: JSON.stringify({})}).then((sorts) => {
                Utils.nProgress.done();
                this.setState({
                    sorts, loading: false
                });
                ProductUtils.setCurrentPage(pagination.current);
            }
        );
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    remove = (id, index) => {
        let _this = this;
        Modal.confirm({
            title: `确认删除操作?`,
            onOk() {
                App.api('adm/product/remove', {id}).then(() => {
                    message.success('删除成功！');
                    let products = _this.state.products;
                    _this.setState({
                        products: U.array.remove(products, index)
                    })
                })
            },
            onCancel() {
            },
        });
    };

    pass = (product) => {
        let _this = this;
        Modal.confirm({
            title: `是否通过审核?`,
            onOk() {
                product.state = 2;
                App.api('adm/product/save', {

                    product: JSON.stringify(product)

                }).then(() => {
                    message.success('已保存');
                    _this.loadData();
                });
            },
            onCancel() {
                product.state = 3;
                App.api('adm/product/save', {

                    product: JSON.stringify(product)

                }).then(() => {
                    message.success('已保存');
                    _this.loadData();
                });
            },
        });
    };

    edit = (product) => {
        App.go(`/app/info/product-edit/${product.id}`)
    };

    putSome = () => {
        let {selectedRowKeys} = this.state;
        App.api(`adm/product/putsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量上架成功！");
                this.loadData();
            }
        });
    };

    outSome = () => {
        let {selectedRowKeys} = this.state;
        App.api(`adm/product/outsome`, {ids: JSON.stringify(selectedRowKeys)}).then((v) => {
            if (v == null) {
                message.success("批量下架成功！");
                this.loadData();
            }
        });
    };

    removesome = () => {
        let {selectedRowKeys} = this.state;
        selectedRowKeys.map((id) => {
            App.api(`adm/product/remove`, {id})
        });
        message.success("批量删除成功！");
        this.loadData();
    };

    renderImg = (item) => {
        let {productItems = []} = item;
        let {imgs = []} = productItems[0] || [];
        return <img key={imgs[0]} className='product-img' src={imgs[0] + '@!120-120'}
                    onClick={() => {
                        Utils.common.showImgLightbox(imgs, 0);
                    }}/>
    };

    showDrawer = (items) => {
        this.setState({
            items,
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {

        let {codes = [], q, loading, products = [], pagination = {}, visible, items, disabled, sorts = []} = this.state;

        let {productItems = []} = items;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.info_product.txt}/>

            <Card bordered={false}>

                <Row>

                    <Col span={12}>

                        <Button type="primary" icon="file-add" onClick={() => {
                            this.edit({id: 0})
                        }}>添加商品</Button>

                        <Button type="primary" icon="edit" disabled={disabled} onClick={() => {
                            this.putSome();
                        }}>批量上架</Button>

                        <Button type="primary" icon="edit" disabled={disabled} onClick={() => {
                            this.outSome();
                        }}>批量下架</Button>

                        <Button type="primary" icon="delete" disabled={disabled} onClick={() => {
                            this.removesome();
                        }}>批量删除</Button>

                    </Col>

                    <Col span={12} style={{textAlign: 'right'}}>

                        <TreeSelect
                            style={{width: 200, marginRight: 10}}
                            value={codes}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="按照分类查询"
                            allowClear
                            treeDefaultExpandAll
                            treeCheckable={true}
                            showCheckedStrategy={"SHOW_PARENT"}
                            onChange={(codes) => {
                                this.setState({codes})
                            }}>
                            {sorts.map((t1, index1) => {
                                let {sequence, name, children = []} = t1;
                                return <TreeNode value={sequence} title={name} key={index1}>
                                    {children.map((t2, index2) => {
                                        let {sequence, name, children = []} = t2;
                                        return <TreeNode value={sequence} title={name} key={`${index1}-${index2}`}>
                                            {children.map((t3, index3) => {
                                                let {sequence, name} = t3;
                                                return <TreeNode value={sequence} title={name}
                                                                 key={`${index1}-${index2}-${index3}`}/>
                                            })}
                                        </TreeNode>
                                    })}
                                </TreeNode>
                            })}
                        </TreeSelect>

                        <InputSearch
                            placeholder="输入商品名称查询"
                            style={{width: 200}}
                            value={q}
                            onChange={(e) => {
                                this.setState({q: e.target.value});
                            }}
                            onSearch={(v) => {
                                this.setState({
                                    q: v, pagination: {
                                        ...pagination,
                                        current: 1
                                    }
                                }, () => {
                                    this.loadData()
                                });
                            }}/>
                    </Col>

                </Row>

                <Table

                    rowSelection={this.rowSelection}

                    columns={[

                        {
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            render: (col, row, i) => {
                                return <span>{(pagination.current - 1) * pagination.pageSize + (i + 1)}</span>
                            },
                        },

                        {
                            title: '图片',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => this.renderImg(item)
                        },

                        {
                            title: '名称',
                            dataIndex: 'title',
                            className: 'txt-center',
                        },

                        {
                            title: '商品规格',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => {
                                return <Tag color='purple' onClick={() => {
                                    this.showDrawer(item);
                                }
                                }>规格详情</Tag>
                            }
                        },

                        {
                            title: '商品类型',
                            dataIndex: 'sortId',
                            className: 'txt-center',
                            render: (sortId) => ProductUtils.renderCategoryTags(sorts, sortId)
                        },
                        {
                            title: '审核状态',
                            dataIndex: 'state',
                            className: 'txt-center',
                            render: (obj, product) => {
                                return <div className="state">
                                    {product.state === 1 ? <Badge dot><span className="warning" onClick={() => {
                                        this.pass(product)
                                    }}>待审核</span></Badge> : (product.state === 2 ?
                                        <span className="pass">已通过</span> : <span className="nopass">未通过</span>)}
                                </div>
                            }
                        },

                        {
                            title: '上架状态',
                            dataIndex: 'status',
                            className: 'txt-center',
                            render: (obj, c) => {
                                return <div className="state">
                                    {c.status === 1 ? <span className="important">上架中</span> :
                                        <span className="disabled">已下架</span>}
                                </div>
                            }
                        },

                        {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            render: (obj, product, index) => {
                                return <Dropdown overlay={<Menu>
                                    <Menu.Item key="1">
                                        <a onClick={() => this.edit(product)}>编辑</a>
                                    </Menu.Item>
                                    <Menu.Divider/>
                                    <Menu.Item key="2">
                                        <a onClick={() => this.remove(product.id, index)}>删除</a>
                                    </Menu.Item>
                                </Menu>} trigger={['click']}>
                                    <a className="ant-dropdown-link">操作 <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            }
                        }

                    ]}

                    rowKey={(record) => record.id}

                    dataSource={products}

                    loading={loading}

                    pagination={{...pagination, ...CTYPE.commonPagination}}

                    onChange={this.handleTableChange}
                />

            </Card>

            <Drawer
                title="规格详情："
                placement="right"
                width={600}
                closable={false}
                onClose={this.onClose}
                visible={visible}
            >
                <Table
                    dataSource={productItems}
                    pagination={false}
                    onChange={this.handleTableChange}
                    rowKey={(item) => item.id}
                    columns={[
                        {
                            title: "图片展示",
                            dataIndex: "imgs",
                            className: "txt-center",
                            render: (row, item) => {
                                let {imgs = []} = item;
                                return <img src={imgs[0] + '@!120-120'} onClick={() => {
                                    Utils.common.showImgLightbox(imgs, 0);
                                }}/>
                            }
                        }, {
                            title: "商品规格",
                            dataIndex: "params",
                            render: (row, item) => {
                                let {params = []} = item;
                                return <div>{params.map((aaa) => {
                                    let {label, value} = aaa;
                                    return <div>
                                        <Tag color="purple">{label}</Tag>
                                        <span>: </span>
                                        <Tag color="blue">{value}</Tag>
                                    </div>
                                })}</div>

                            }
                        }, {
                            title: "商品价格",
                            dataIndex: "price",
                            className: "txt-center",
                            render: (price) => {
                                return <Tag color="magenta">￥{price}</Tag>
                            }
                        }, {
                            title: "库存量",
                            dataIndex: "stock",
                            className: "txt-center",
                            render: (stock) => {
                                return <Tag color="cyan">{stock}</Tag>
                            }
                        },
                    ]}
                />
            </Drawer>
        </div>
    }
}
