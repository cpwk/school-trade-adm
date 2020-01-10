import React from 'react'
import Utils from '../../common/Utils.jsx'
import {Form, Modal} from 'antd';

const id_div = 'div-dialog-buy-vip';

class VipBuy extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        return <Modal title={'微信扫码'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      style={{width: '500px', height: '500px'}}
                      footer={null}
                      onCancel={this.close}>
            <img src='../../assets/image/vip/weixin.png' style={{width: '475px', height: '475px'}}/>
        </Modal>
    }
}

export default Form.create()(VipBuy);