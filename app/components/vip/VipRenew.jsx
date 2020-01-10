import React from 'react'
import App from '../../common/App.jsx'
import Utils from '../../common/Utils.jsx'
import {Form, message, Modal} from 'antd';
import {CTYPE} from "../../common";
import {CommonPeriodSelector} from "../common/CommonComponents";

const FormItem = Form.Item;

const id_div = 'div-dialog-merchant-renew';

export default class VipRenew extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.id),
            duration: '6M'
        };
    }

    componentDidMount() {
    }

    submit = () => {

        let {id, duration} = this.state;

        App.api('adm/vip/renew', {
            id, duration
        }).then(() => {
            this.props.loadData();
            message.success('续期成功');
            this.close();
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {duration} = this.state;

        return <Modal title="账号续期"
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      onOk={this.submit}
                      onCancel={this.close}>

            <FormItem
                {...CTYPE.dialogItemLayout}
                label={<span>续期时长</span>}>

                <CommonPeriodSelector periods={CTYPE.expirePeriods} period={duration} withForever={false}
                                      syncPeriod={(val) => {
                                          this.setState({
                                              duration: val
                                          })
                                      }}/>
            </FormItem>
        </Modal>
    }
}
