import React from 'react'
import {Input, InputNumber, message, Modal} from 'antd';
import Utils from "../../common/Utils";
import '../../assets/css/common/common-edit.less'
import {App, U} from "../../common";

const id_div = 'div-dialog-mod-pwd';

export default class SortEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            parent: this.props.parent
        };
    }

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    save = () => {
        let {type, parent = {}} = this.state;
        let {id, sequence = '', priority = 1, level, index} = type;

        if (id === 0) {
            let _index = U.date.pad(index);
            if (level === 1) {
                sequence = _index + '0000';
            } else if (level === 2) {
                sequence = parent.sequence.substring(0, 2) + _index + '00';
            } else {
                sequence = parent.sequence.substring(0, 4) + _index;
            }
            type.sequence = sequence;
            type.priority = priority;
            type.parentId = parent.id;
            type.status = 1;
        }

        App.api('adm/sort/save', {sort: JSON.stringify(type)}).then(() => {
            message.success('提交成功');
            this.close();
            this.props.loadData();
        })
    };

    render() {

        let {type = {}} = this.state;
        let {id, name, priority = 1} = type;

        return <Modal title={id > 0 ? '编辑分类' : '新建分类'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'500px'}
                      onOk={this.save}
                      onCancel={this.close}>

            <div className='common-edit-page'>

                <div className='form'>
                    <div className='line'>
                        <div className='p required'>名称</div>
                        <Input value={name} onChange={(e) => {
                            this.setState({
                                type: {
                                    ...type,
                                    name: e.target.value
                                }
                            })
                        }}/>
                    </div>
                    <div className='line'>
                        <div className='p required'>权重</div>
                        <InputNumber max={100} min={1} value={priority} onChange={(v) => {
                            this.setState({
                                type: {
                                    ...type,
                                    priority: v
                                }
                            })
                        }}/>
                    </div>
                </div>
            </div>
        </Modal>
    }
}