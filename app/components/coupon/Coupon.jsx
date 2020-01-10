import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Card, Col, Row, Table, Tag} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import CTYPE from '../../common/CTYPE'
import '../../assets/css/common/common-list.less'
import CouponUtils from "./CouponUtils";

export default class Coupon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            disabled: true,
            items: {},
            coupons: [],
            loading: false,
            sort: []
        };
    }

    componentDidMount() {
        U.setWXTitle('购物券管理');
        this.loadData();
    }

    loadData = () => {
        this.setState({loading: true});
        Utils.nProgress.start();
        App.api('adm/coupon/coupons', {
            couponQo: JSON.stringify({})
        }).then((coupons) => {
                Utils.nProgress.done();
                this.setState({
                    coupons,
                    loading: false
                });
            }
        );

        App.api('adm/sort/sorts', {sortQo: JSON.stringify({})}).then((sort) => {
                Utils.nProgress.done();
                this.setState({
                    sort
                });
            }
        );
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    edit = (coupon) => {
        CouponUtils.edit(coupon, this.loadData)
    };

    renderImg = (item) => {
        let {img} = item;
        return <img key={img} className='product-img' src={img + '@!120-120'}
                    onClick={() => {
                        Utils.common.showImgLightbox([img], 0);
                    }}/>
    };

    renderCategoryTags = (code) => {
        let ret = '';
        let {sort = []} = this.state;
        {
            sort.map((c, index) => {
                let {name} = c;
                if (code === c.sequence) {
                    ret = <Tag key={index} color="cyan">{name}</Tag>;
                }
            })
        }
        if (code === "000000") {
            ret = <Tag color="gold">全品通用</Tag>;
        }
        return ret
    };

    render() {

        let {loading, coupons = []} = this.state;

        return <div className="common-list">

            <BreadcrumbCustom first={CTYPE.link.info_coupon.txt}/>

            <Card bordered={false}>

                <Row>
                    <Col span={12}>
                        <Button type="primary" icon="file-add" onClick={() => {
                            this.edit({id: 0})
                        }}>新建优惠券</Button>
                    </Col>
                </Row>
                <Table
                    pagination={false}
                    columns={[
                        {
                            title: '序号',
                            dataIndex: 'id',
                            className: 'txt-center',
                            render: (col, row, i) => {
                                return <span>{(i + 1)}</span>
                            },
                        },

                        {
                            title: '商品图',
                            dataIndex: '',
                            className: 'txt-center',
                            render: (item) => this.renderImg(item)
                        },

                        {
                            title: '类型',
                            dataIndex: 'code',
                            className: 'txt-center',
                            render: code => this.renderCategoryTags(code)
                        },

                        {
                            title: '方案',
                            dataIndex: 'rules',
                            className: 'txt-center',
                            render: (rules, item) => {
                                let {rule = {}} = item;
                                let {values = []} = rule;
                                if (rule.type === 1) {
                                    return <div>满
                                        <a style={{color: '#f50'}}>{values[0]}</a>
                                        减
                                        <span style={{color: '#f50'}}>{values[1]}</span></div>
                                }
                                if (rule.type === 2) {
                                    return <div>每
                                        <span style={{color: 'blue'}}>{values[0]}</span>
                                        减
                                        <span style={{color: 'blue'}}>{values[1]}</span></div>
                                }
                                if (rule.type === 3) {
                                    return <div>直减
                                        <span style={{color: 'purple'}}>{values[0]}</span>
                                    </div>
                                }
                            }
                        },

                        {
                            title: '持续时间',
                            dataIndex: 'duration',
                            className: 'txt-center',
                            render: (duration) => {
                                return <Tag color='orange'>
                                    {duration}天
                                </Tag>
                            }
                        },

                        {
                            title: '状态',
                            dataIndex: 'status',
                            className: 'txt-center',
                            render: (obj, c) => {
                                return <div className="state">
                                    {c.status === 1 ? <span className="important">启用</span> :
                                        <span className="disabled">禁用</span>}
                                </div>
                            }
                        },

                        {
                            title: '操作',
                            dataIndex: 'opt',
                            className: 'txt-center',
                            render: (obj, coupon) => {
                                return <Tag color='red' onClick={() => this.edit(coupon)}>
                                    编辑
                                </Tag>
                            }
                        }
                    ]}
                    rowKey={(record) => record.id}
                    dataSource={coupons}
                    loading={loading}
                    onChange={this.handleTableChange}
                />
            </Card>
        </div>
    }
}