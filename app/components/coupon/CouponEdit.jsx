import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, InputNumber, message, Modal, Select, Switch, TreeSelect} from 'antd';
import '../../assets/css/common/common-edit.less'
import {OSSWrap} from "../../common";

const {Option} = Select;
const {TreeNode} = TreeSelect;
const id_div = 'div-dialog-coupon-edit';

export default class couponEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            coupon: this.props.coupon,
            uploading: false
        };
    }

    componentDidMount() {
        this.load()
    }

    load = () => {
        App.api('adm/sort/sorts', {}).then((list) => {
            this.setState({list});

        })
    };

    handleNewImage = e => {

        let {uploading = true, coupon = {}} = this.state;

        let img = e.target.files[0];

        if (!img || img.type.indexOf('image') < 0) {
            message.error('文件类型不正确,请选择图片类型');
            this.setState({
                uploading: false
            });
            return;
        }
        if (uploading) {
            message.loading('上传中');
            return;
        }

        this.setState({uploading: true});


        OSSWrap.upload(img).then((result) => {
            this.setState({
                coupon: {
                    ...coupon,
                    img: result.url
                }, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });

    };

    submit = () => {

        let {coupon = {}} = this.state;
        let {code, rule = {}, duration, price, img} = coupon;
        let {values, type} = rule;


        if (U.str.isEmpty(code)) {
            message.warn('请选择类型');
            return;
        }
        if (U.str.isEmpty(rule) || values.length === 0 || values === null) {
            message.warn('请填写规则');
            return;
        }

        if (type !== 3) {
            if (values[0] < values[1]) {
                message.warn("规则金额填写错误");
                return
            }
        }

        if (U.str.isEmpty(price)) {
            coupon.price = 0;
        }

        if (U.str.isEmpty(duration)) {
            message.warn('请填写持续时间');
            return;
        }

        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }

        App.api('adm/coupon/save', {
                coupon: JSON.stringify(coupon)
            }
        ).then(() => {
                message.success('已保存');
                this.props.loadData();
                this.close();
            }
        );
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {coupon = {}, list = []} = this.state;
        let {rule = {}, code, price, duration, img, status} = coupon;
        let {type, values = [0, 0]} = rule;
        {
            !list.find(a => a.sequence === "000000") && list.push({sequence: "000000", name: "全品"})
        }
        return <Modal title={'编辑优惠券'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'500px'}
                      style={{marginTop: -33}}
                      okText='确定'
                      cancelText='取消'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <p className='p required'>类型</p>
                        <TreeSelect
                            showSearch={false}
                            style={{width: 130}}
                            value={code}
                            dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                            placeholder="请选择类型"
                            allowClear={true}
                            treeDefaultExpandAll={false}
                            onChange={(code) => {
                                this.setState({
                                    coupon: {
                                        ...coupon,
                                        code
                                    }
                                })
                            }}>
                            {list.map((c1, i1) => {
                                let {children = []} = c1;
                                return <TreeNode value={c1.sequence} title={c1.name} key={`${i1}`}>
                                    {children.map((c2, i2) => {
                                        let {children = [], id, status} = c2;
                                        return <TreeNode value={c2.sequence} title={c2.name} key={`${i1}-${i2}`}
                                                         disabled>
                                            {children.map((c3, i3) => {
                                                return <TreeNode value={c3.sequence} title={c3.name}
                                                                 key={`${i1}-${i2}-${i3}`} disabled/>
                                            })}
                                        </TreeNode>
                                    })}
                                </TreeNode>
                            })}
                        </TreeSelect>
                    </div>
                    <div className="line">
                        <p className='p required'>规则</p>
                        <Select style={{width: '130px'}} value={type} placeholder='请选择规则' onChange={(v) =>
                            this.setState({
                                coupon: {
                                    ...coupon,
                                    rule: {
                                        ...rule,
                                        type: v
                                    }
                                }
                            })
                        }>
                            <Option value={1}>满减</Option>
                            <Option value={2}>每减</Option>
                            <Option value={3}>直减</Option>

                        </Select>
                    </div>

                    <div className="line">
                        <p className='p required'>方案</p>

                        {type !== 3 && <div style={{marginLeft: '3px'}}>
                            {type === 2 ? '每' : '满'}&nbsp;&nbsp;&nbsp;
                            <InputNumber
                                style={{width: '80px'}}
                                value={values[0]} min={0}
                                onChange={(v) => {
                                    values[0] = v;
                                    this.setState({
                                        coupon: {
                                            ...coupon,
                                            rule: {
                                                ...rule,
                                                values
                                            }
                                        }
                                    })
                                }}/>&nbsp;&nbsp;&nbsp;减&nbsp;&nbsp;&nbsp;
                            <InputNumber
                                style={{width: '80px'}}
                                value={values[1]} min={0}
                                onChange={(v) => {
                                    values[1] = v;
                                    this.setState({
                                        coupon: {
                                            ...coupon,
                                            rule: {
                                                ...rule,
                                                values
                                            }
                                        }
                                    })
                                }}/>
                        </div>}

                        {type === 3 && <div>直减<InputNumber
                            style={{width: '80px'}}
                            value={values[0]} min={0}
                            onChange={(v) => {
                                values = [];
                                values[0] = v;
                                this.setState({
                                    coupon: {
                                        ...coupon,
                                        rule: {
                                            ...rule,
                                            values
                                        }
                                    }
                                })
                            }}/></div>}

                    </div>

                    <div className="line">
                        <p className='p required'>价格</p>
                        <InputNumber
                            style={{width: '80px', marginLeft: '27px'}}
                            value={price}
                            onChange={(v) => {
                                this.setState({
                                    coupon: {
                                        ...coupon,
                                        price: v
                                    }
                                })
                            }}/>&nbsp;&nbsp;&nbsp;元
                    </div>

                    <div className="line">
                        <p className='p required' style={{marginLeft: '28px'}}>持续时间</p>
                        <InputNumber
                            style={{width: '80px'}}
                            value={duration} min={1}
                            onChange={(v) => {
                                this.setState({
                                    coupon: {
                                        ...coupon,
                                        duration: v
                                    }
                                })
                            }}/>&nbsp;&nbsp;&nbsp;天
                    </div>

                    <div className="line">
                        <p className='p'>启用</p>
                        <Switch style={{marginTop: '5px'}} checked={status === 1} onChange={(chk) => {
                            this.setState({
                                coupon: {
                                    ...coupon,
                                    status: chk ? 1 : 2
                                }
                            })
                        }}/>
                    </div>

                    <div className="line" style={{width: '85%'}}>
                        <p className='p required'>图片</p>
                        <div style={{width: '80%'}}>
                            <div className='common-edit-page'>
                                <div className='form'>
                                    <div className='line'>
                                        <div className='upload-img-preview' style={{width: '100px', height: '100px'}}>
                                            {img && < img src={img} style={{width: '100px', height: '100px'}}/>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file' onChange={this.handleNewImage}/>
                                    选择图片</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    }
}
