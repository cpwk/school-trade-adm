import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Form, Input, message, Modal} from 'antd';
import {CTYPE} from "../../common";

const FormItem = Form.Item;

const id_div = 'div-dialog-merchant-admin';

class MerchantAdminAdd extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            merchant: this.props.merchant
        };
    }

    componentDidMount() {
    }

    submit = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                Object.keys(err).forEach(key => {
                    message.warning(err[key].errors[0].message);
                });
            } else {
                let {merchant = {}} = this.state;
                let {name, mobile, password} = values;
                App.api('oms/merchant/create_admin', {
                    admin: JSON.stringify({
                        merchantId: merchant.id,
                        name, mobile, password
                    })
                }).then(() => {
                    message.success('添加成功');
                    this.close();
                });
            }
        })
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        const {getFieldDecorator} = this.props.form;

        let {merchant = {}} = this.state;
        let {name} = merchant;

        return <Modal title="添加商户管理员"
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      onOk={this.submit}
                      onCancel={this.close}>

            <Form>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="商户名称">
                    {name}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="姓名">
                    {getFieldDecorator('name', {
                        rules: [{required: true}],
                    })(
                        <Input placeholder="姓名"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="手机号">
                    {getFieldDecorator('mobile', {
                        rules: [{required: true}],
                    })(
                        <Input placeholder="手机号"/>
                    )}
                </FormItem>
                <FormItem
                    {...CTYPE.dialogItemLayout}
                    label="密码">
                    {getFieldDecorator('password', {
                        rules: [{required: true}],
                    })(
                        <Input type='password' placeholder="密码"/>
                    )}
                </FormItem>
            </Form>

        </Modal>
    }
}

export default Form.create()(MerchantAdminAdd);