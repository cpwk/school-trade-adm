import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Form, Input, message, Modal, Select} from 'antd';
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-order-edit';
const FormItem = Form.Item;
const Option = Select.Option;

export default class OrderEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            order: this.props.order,
            uploading: false,
            sort: [],
            checkedKeys: []
        };
    }


    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    submit = () => {
        let {order = {}} = this.state;

        App.api('user/order/save', {
                order: JSON.stringify(order)
            }
        ).then(() => {
            message.success('已保存');
            this.props.loadData();
            this.close();
        });
    };

    render() {

        let {order = {}} = this.state;
        let {addressId, status} = order;
        console.log(order);
        console.log(addressId);

        return <Modal title={'编辑订单'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'1000px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <p>地址</p>
                        <Input style={{width: 300}} className="input-wide" placeholder="输入地址"
                               value={addressId} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       order: {
                                           ...order,
                                           addressId: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p>状态</p>
                        <Input style={{width: 300}} className="input-wide" placeholder="更改状态"
                               value={status} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       order: {
                                           ...order,
                                           status: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                </div>
            </div>
        </Modal>
    }
}
