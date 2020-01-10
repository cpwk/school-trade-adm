import React from 'react';
import {Button, Card, Form, Input, message, TreeSelect} from 'antd';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";
import BreadcrumbCustom from '../../components/common/BreadcrumbCustom';
import {Link} from 'react-router-dom';
import '../../assets/css/common/common-edit.less'
import {PosterEdit} from "../../common/CommonEdit";
import ProductUtils from "../product/ProductUtils";
import {CommonPeriodSelector} from "../common/CommonComponents";

const FormItem = Form.Item;
const {SHOW_PARENT} = TreeSelect;

export default class MerchantEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),

            merchant: {},
            merchantAdmin: {},

            productCategories: []


        }
    }

    componentDidMount() {
        this.loadData();
        ProductUtils.loadProductCategories(this);
    }

    loadData = () => {
        let {id} = this.state;
        if (id !== 0) {
            App.api('oms/merchant/item', {id}).then((merchant) => {
                this.setState({
                    merchant
                });
            })
        }
    };

    handleSubmit = () => {

        let {id, merchant = {}, merchantAdmin = {}} = this.state;

        let {name, logo = [], duration} = merchant;
        let {mobile, password} = merchantAdmin;

        let create = id === 0;

        if (U.str.isEmpty(name)) {
            message.warn('请填写商户名称');
            return;
        }

        if (U.str.isEmpty(logo)) {
            message.warn('请上传图片');
            return;
        }

        if (create) {

            if (U.str.isEmpty(duration)) {
                merchant.duration = '1Y';
            }

            if (U.str.isEmpty(merchantAdmin.name)) {
                message.warn('请输入管理员姓名');
                return;
            }
            if (!U.str.isChinaMobile(mobile)) {
                message.warn('请填写正确的手机号');
                return;
            }
            if (U.str.isEmpty(password)) {
                message.warn('请输入管理员密码');
                return;
            }
        }

        App.api(create ? 'oms/merchant/create' : 'oms/merchant/update', {
            merchant: JSON.stringify(merchant),
            merchantAdmin: JSON.stringify(merchantAdmin)
        }).then((res) => {
            message.success('已保存');
            window.history.back();
        });
    };


    render() {

        let {id, merchant = {}, merchantAdmin = {}, productCategories = []} = this.state;

        let {name, logo, duration = '1Y', productCategorySequences = []} = merchant;

        let {mobile, password} = merchantAdmin;

        let create = id === 0;

        return <div className="common-edit-page">

            <BreadcrumbCustom
                first={<Link to={CTYPE.link.merchant_merchants.path}>{CTYPE.link.merchant_merchants.txt}</Link>}
                second='创建商户'/>


            <Card extra={<Button type="primary" icon="save" onClick={() => {
                this.handleSubmit()
            }}>保存</Button>}>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='商户名称'>
                    <Input placeholder="输入商户名称"
                           value={name} maxLength={25}
                           onChange={(e) => {
                               this.setState({
                                   merchant: {
                                       ...merchant,
                                       name: e.target.value
                                   }
                               })
                           }}/>
                </FormItem>

                <PosterEdit title='logo' type='s' scale={'200*200'} img={logo} required={true} syncPoster={(url) => {
                    merchant.logo = url;
                    this.setState({
                        merchant
                    });
                }}/>

                <FormItem
                    required={true}
                    {...CTYPE.formItemLayout} label='经营范围'>

                    {productCategories.length > 0 && <TreeSelect style={{width: 300}}
                                                                 treeData={productCategories}
                                                                 value={productCategorySequences}
                                                                 treeCheckable={true}
                                                                 showCheckedStrategy={SHOW_PARENT}
                                                                 dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                                                                 placeholder="请选择分类"
                                                                 allowClear
                                                                 treeDefaultExpandAll
                                                                 onChange={(v, labels) => {
                                                                     this.setState({
                                                                         merchant: {
                                                                             ...merchant,
                                                                             productCategorySequences: v
                                                                         }
                                                                     })
                                                                 }}/>}

                </FormItem>


                {create && <React.Fragment>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label='套餐时长'>
                        <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
                                              syncPeriod={(val) => {
                                                  this.setState({
                                                      merchant: {
                                                          ...merchant,
                                                          duration: val
                                                      }
                                                  })
                                              }}/>
                    </FormItem>

                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label="管理员姓名">
                        <Input value={merchantAdmin.name} style={{width: 200}} onChange={(e) => {
                            this.setState({
                                merchantAdmin: {
                                    ...merchantAdmin,
                                    name: e.target.value
                                }
                            })
                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label="管理员手机号">
                        <Input value={mobile} style={{width: 200}} onChange={(e) => {
                            this.setState({
                                merchantAdmin: {
                                    ...merchantAdmin,
                                    mobile: e.target.value
                                }
                            })
                        }}/>
                    </FormItem>
                    <FormItem
                        required={true}
                        {...CTYPE.formItemLayout}
                        label="登录密码">
                        <Input value={password} style={{width: 200}} onChange={(e) => {
                            this.setState({
                                merchantAdmin: {
                                    ...merchantAdmin,
                                    password: e.target.value
                                }
                            })
                        }}/>
                    </FormItem>
                </React.Fragment>}

            </Card>

        </div>
    }
}
