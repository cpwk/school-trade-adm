import React from 'react'
import {App, CTYPE, U, Utils} from '../.././common'
import {Button, Card, Form, Icon, Input, InputNumber, message, Modal, Radio} from 'antd';
import {Link} from 'react-router-dom';
import BreadcrumbCustom from "../common/BreadcrumbCustom";
import '../../assets/css/common/common-edit.less'
import '../../assets/css/vip/vipedit.scss'
import {CommonPeriodSelector} from "../../components/common/CommonComponents";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class VipEditForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            show_edit: false,
            vip: {},
            snos: [],
            index: 0
        };
    }

    componentDidMount() {
        this.loadData()
    }

    loadData = () => {
        let id = this.state.id;
        if (id && id > 0) {
            App.api('adm/vip/vip', {id}).then((vip) => {

                this.setState({
                    vip
                });
                this.setForm(vip);
            })
        }
        this.setForm({});
    };

    showEdit = (val, priceRule, index) => {
        this.setState({show_edit: val || false});
        if (priceRule !== undefined && index > -1) {
            this.setState({index: index, priceRule: priceRule})
        }
    };

    setForm = (vip) => {
        let {name, grade, status, intro} = vip;
        this.props.form.setFieldsValue({name, grade, status, intro});
    };

    remove = (index) => {
        let {vip} = this.state;
        let {priceRule = []} = vip;
        Modal.confirm({
            title: '确认删除操作?',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                priceRule = U.array.remove(priceRule, index);
                this.setState({
                    vip
                });
            },
            onCancel() {
            },
        });
    };

    syncPoster = (index) => {
        this.doImgOpt(index, 0, 'add');
    };

    doImgOpt = (index, opt) => {

        let {vip = {}} = this.state;
        let {priceRule = []} = vip;

        if (opt === 'top') {
            if (index === 0) {
                message.warn('已经是第一个');
                return;
            }
            priceRule = U.array.swap(priceRule, index, index - 1);
        } else if (opt === 'down') {
            if (index === priceRule.length - 1) {
                message.warn('已经是最后一个');
                return;
            }
            priceRule = U.array.swap(priceRule, index, index + 1);
        }
        this.setState({
            vip: {
                ...vip,
                priceRule
            }
        });
    };

    handleSubmit = (e) => {

        let {snos = []} = this.state;

        e.preventDefault();

        this.props.form.validateFields((err, vip) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            }


            if (!err) {
                let id = this.state.id;
                vip.id = id > 0 ? id : null;

                let _vip = this.state.vip;
                let {status} = vip;

                let {priceRule = []} = this.state.vip;

                if (U.str.isEmpty(status)) {
                    message.warn('选择状态');
                    return;
                }


                let err_str = '';
                let err_index = -1;

                if (priceRule.length > 0) {
                    let _priceRule = JSON.parse(JSON.stringify(priceRule));
                    _priceRule.reverse().map((item, index) => {
                        let {duration, price, sno} = item;
                        snos.push(sno);
                        if (U.str.isEmpty(duration)) {
                            err_index = index;
                            err_str = '请填写有效期'
                        }
                        if (U.str.isEmpty(price)) {
                            err_index = index;
                            err_str = '请填写价格'
                        }
                        if (U.str.isEmpty(sno)) {
                            err_index = index;
                            err_str = '请填写编号'
                        }
                    });
                } else {
                    message.warn("请填写价格规则");
                    return
                }

                if (err_index > -1) {
                    message.warning(`第${priceRule.length - err_index}组规则填写有误，错误信息：${err_str}`);
                    return;
                }

                let snos2 = [...new Set(snos)];
                if (snos2.length < snos.length) {
                    this.setState({snos: []});
                    message.warn("编号不能重复,请修改后提交");
                    return
                }
                {
                    vip.status = status;
                    vip.intro = vip.intro || '';
                    vip.priceRule = _vip.priceRule;
                }

                App.api('adm/vip/save', {vip: JSON.stringify(vip)}).then(() => {
                    message.success('保存成功');
                    setTimeout(() => {
                        App.go('/app/info/vip')
                    }, 500);
                });

            }
        });
    };

    render() {
        let {vip = {}, show_edit, id, index} = this.state;
        let {priceRule = [{}]} = vip;
        let {duration = "0D", price, sno} = priceRule[index] || {};
        const {getFieldDecorator} = this.props.form;

        return <div className="common-edit-page">
            <Form onSubmit={this.handleSubmit}>
                <Card title={<BreadcrumbCustom

                    first={<Link to={CTYPE.link.vip.path}>{CTYPE.link.vip.txt}</Link>}
                    second='编辑会员等级'
                />
                }
                      bordered={false}
                      extra={<Button type="primary" htmlType="submit">{id > 0 ? '保存' : '发布'}</Button>}
                      style={CTYPE.formStyle}>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='名称'
                        hasFeedback>
                        {getFieldDecorator('name', {rules: [{required: true, message: '名称不能为空!'}]})(
                            <Input placeholder="请输入名称"/>,
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='等级'
                        hasFeedback>
                        {getFieldDecorator('grade', {rules: [{required: true, message: '等级不能为空!'}]})(
                            <InputNumber placeholder="请填等级" min={1}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='是否上架'>
                        {getFieldDecorator('status')(
                            <RadioGroup>
                                <Radio value={1}>上架</Radio>
                                <Radio value={2}>下架</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>

                    <FormItem
                        {...CTYPE.formItemLayout}
                        label='价格规则'>
                        <div>
                            <Button type='primary' onClick={() => {
                                priceRule.push({});
                                this.setState({
                                    vip: {
                                        ...vip,
                                        priceRule
                                    }
                                })
                            }}>添加价格规则<Icon type="plus-circle"/></Button>
                            {priceRule.map((p, index) => {
                                let {duration = "0D", price, sno} = p;

                                return <Card className='ant-body' size='small'
                                             key={index}>
                                    <ul>
                                        <li>
                                            <div className='b-info'>
                                                <div className='title-line'>
                                                    <div className='index'>编号:{sno}</div>
                                                    <div className='title'>有效期:{Utils.parseDay(duration)}</div>
                                                    <div className='price'>金额:￥{price}</div>
                                                </div>
                                                <div className='down'>
                                                    <div className='ant-btn-group'>
                                                        {index === 0 &&
                                                        <Button disabled={true} className='ant-btn-a'
                                                                onClick={() => this.doImgOpt(index, 'top')}
                                                        ><Icon type="arrow-up"/>上移</Button>}
                                                        {index !== 0 &&
                                                        <Button disabled={false} className='ant-btn-a'
                                                                onClick={() => this.doImgOpt(index, 'top')}
                                                        ><Icon type="arrow-up"/>上移</Button>}
                                                        {index === priceRule.length - 1 &&
                                                        <Button disabled={true} className='ant-btn-a'
                                                                onClick={() => this.doImgOpt(index, 'down')}
                                                        ><Icon type="arrow-down"/>下移</Button>}
                                                        {index !== priceRule.length - 1 &&
                                                        <Button disabled={false} className='ant-btn-a'
                                                                onClick={() => this.doImgOpt(index, 'down')}
                                                        ><Icon type="arrow-down"/>下移</Button>}
                                                    </div>
                                                    <Button className='ant-btn-sm'
                                                            onClick={() => this.showEdit(true, priceRule, index)}><Icon
                                                        type="edit"/>编辑</Button>
                                                    <Button className='ant-btn-sm'
                                                            onClick={() => this.remove(index)}><Icon
                                                        type="delete"/>移除</Button>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </Card>
                            })}
                        </div>
                    </FormItem>
                    {<div>
                        <FormItem
                            {...CTYPE.formItemLayout}
                            label="会员简介">
                            {getFieldDecorator('intro')(
                                <Input.TextArea rows={3}/>)}
                        </FormItem>
                    </div>}
                </Card>
            </Form>
            <Modal title={'编辑收费规则'}
                   visible={show_edit}
                   width={'500px'}
                   okText='提交'
                   cancelText='取消'
                   onOk={() => this.showEdit(false, this.state.priceRule, this.state.index)}
                   onCancel={() => this.showEdit()}>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label={<span>有效期</span>} style={{marginTop: 20}}>

                    <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
                                          syncPeriod={(val) => {
                                              let {priceRule, index} = this.state;
                                              priceRule[index].duration = val;
                                              this.setState({
                                                  vip: {
                                                      ...vip,
                                                      priceRule
                                                  },
                                                  duration: val
                                              })
                                          }}/>
                </FormItem>
                <div className="line">
                    <p className='p'>价格</p>
                    <InputNumber
                        value={price} min={1}
                        onChange={(value) => {
                            let {priceRule, index} = this.state;
                            priceRule[index].price = value;
                            this.setState({
                                vip: {
                                    ...vip,
                                    priceRule
                                },
                                price: value
                            });
                        }}/>
                </div>
                <div className="line">
                    <p className='p'>编号</p>
                    <InputNumber
                        value={sno} min={0}
                        onChange={(value) => {
                            let {priceRule, index} = this.state;
                            priceRule[index].sno = value;
                            this.setState({
                                vip: {
                                    ...vip,
                                    priceRule
                                },
                                price: value
                            });
                        }}/>
                </div>
            </Modal>
        </div>
    }
}

const VipEdit = Form.create()(VipEditForm);

export default VipEdit;