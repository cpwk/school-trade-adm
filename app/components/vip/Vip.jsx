import React from 'react';
import {CTYPE, U} from "../../common";
import App from "../../common/App";
import {Button, Card, Icon, message, Modal, Switch, Tag} from "antd";
import VipUtils from "./VipUtils";
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import {Link} from "react-router-dom";
import '../../assets/css/vip/vip.scss'
import Utils from "../../common/Utils";


export default class Vip extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 1,
            vips: []
        };
    }

    componentDidMount() {
        U.setWXTitle('会员设置');
        this.loadData();
    }

    loadData = () => {
        App.api(`/adm/vip/vips`, {
            vipQo: JSON.stringify({})
        }).then((vips) => {
            this.setState({vips});
        })
    };

    modStatus = (item) => {

        let {id, status} = item;

        if (status === 1) {
            Modal.confirm({
                title: `确认上架该会员?`,
                content: null,
                onOk: () => {
                    App.api(`/adm/vip/mod_status`, {id, status}).then(() => {
                        this.loadData();
                        message.success("上架成功！")
                    });
                },
                onCancel() {
                },
            });
        }

        if (status === 2) {
            Modal.confirm({
                title: `确认下架该会员?`,
                content: null,
                onOk: () => {
                    App.api(`/adm/vip/mod_status`, {id, status}).then(() => {
                        this.loadData();
                        message.success("下架成功！")
                    });
                },
                onCancel() {
                },
            });
        }

    };

    remove = (id, index) => {

        Modal.confirm({
            title: `确认删除该会员?`,
            content: null,
            onOk: () => {
                App.api(`/adm/vip/remove`, {id}).then((v) => {
                    if (v == null) {
                        message.success("删除成功!");
                        let vips = this.state.vips;
                        this.setState({
                            address: U.array.remove(vips, index)
                        })
                    }
                })
            },
            onCancel() {
            },
        });
    };

    edit = (id) => {
        App.go(`/app/info/vip-edit/${id}`)
    };

    buy = () => {
        VipUtils.BuyVip();
    };

    render() {

        let {vips = []} = this.state;

        //console.log(vips)

        return <div className='vip-page'>

            <BreadcrumbCustom second={<Link to={CTYPE.link.vip.path}>{CTYPE.link.vip.txt}</Link>}/>

            <div className='vip-add' onClick={() => {
                this.edit(0);
            }}>

                <div className='vip-add-tag'>
                    <i className="fa fa-plus fa-lg">添加会员等级</i>
                </div>
            </div>

            {vips.map((item, index) => {

                //console.log(item);

                let {id, status, name, priceRule = []} = item;

                let actions = [<Button onClick={() => {
                    let {id} = item;
                    this.edit(id);
                }}><Icon type="edit" key="setting"/>编辑</Button>];

                if (status === 1) {
                    actions.push(<Button onClick={() => {
                        this.buy()
                    }}><Icon type="money-collect"/>购买链接</Button>);
                } else {
                    actions.push(<Button disabled='flase'><Icon type="money-collect"/>购买链接</Button>)
                }

                actions.push(
                    <Button onClick={() => {
                        this.remove(id, index)
                    }}><Icon type="delete" key="setting"/>删除</Button>);

                return <Card
                    key={index}
                    hoverable={true}
                    className='vip-card'
                    title={name}
                    extra={<div>
                        <p className='card-status'>上架 ：</p>
                        <Switch checked={status === 1} onChange={(chk) => {
                            item.status = chk ? 1 : 2;
                            this.modStatus(item);
                        }}/>
                    </div>}
                    actions={actions}>
                    <div className='card-price'>
                        {priceRule.map((item, index) => {
                            //console.log(item)
                            let {duration, price} = item;
                            return <div key={index}>
                                <Tag color='red'> {Utils.parseDay(duration)}</Tag>
                                : &nbsp;&nbsp;
                                <Tag color='cyan'> {price}￥</Tag>
                            </div>
                        })}
                    </div>
                </Card>
            })}
        </div>
    }
}