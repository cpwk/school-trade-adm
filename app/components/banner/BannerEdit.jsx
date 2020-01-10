import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Button, Input, InputNumber, message, Modal, Switch} from 'antd';
import {OSSWrap} from "../../common";
import '../../assets/css/common/common-edit.less'

const id_div = 'div-dialog-banner-edit';

export default class BannerEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            banner: this.props.banner,
            uploading: false
        };
    }


    handleNewImage = e => {

        let {uploading, banner = {}} = this.state;

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
                banner: {
                    ...banner,
                    img: result.url
                }, uploading: false
            });
        }).catch((err) => {
            message.error(err);
        });

    };

    submit = () => {

        let {banner = {}} = this.state;
        let {title, status, priority, img} = banner;

        if (U.str.isEmpty(title)) {
            message.warn('请填写名称');
            return;
        }
        if (U.str.isEmpty(img)) {
            message.warn('请上传图片');
            return;
        }
        if (U.str.isEmpty(priority)) {
            banner.priority = 1;
        }
        if (U.str.isEmpty(status)) {
            banner.status = 1;
        }

        App.api('adm/banner/save', {
                banner: JSON.stringify(banner)
            }
        ).then(() => {
            message.success('已保存');
            this.props.loadData();
            this.close();
        });
    };

    close = () => {
        Utils.common.closeModalContainer(id_div)
    };

    render() {

        let {banner = {}} = this.state;
        let {title, status, priority, img} = banner;

        return <Modal title={'编辑Banner'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      width={'1000px'}
                      okText='确定'
                      onOk={this.submit}
                      onCancel={this.close}>
            <div className="common-edit-page">

                <div className="form">

                    <div className="line">
                        <p className='p required'>名称</p>
                        <Input style={{width: 300}} className="input-wide" placeholder="输入名称"
                               value={title} maxLength={64}
                               onChange={(e) => {
                                   this.setState({
                                       banner: {
                                           ...banner,
                                           title: e.target.value
                                       }
                                   })
                               }}/>
                    </div>

                    <div className="line">
                        <p className='p required'>图片</p>
                        <div>
                            <div className='upload-img-preview' style={{width: '480px', height: '182px'}}>
                                {img && <img src={img} style={{width: '480px', height: '182px'}}/>}
                            </div>
                            <div className='upload-img-tip'>
                                <Button type="primary" icon="file-jpg">
                                    <input className="file" type='file' onChange={this.handleNewImage}/>
                                    选择图片</Button>
                                <br/>
                                建议上传图片尺寸<span>1920*730</span>，.jpg、.png格式，文件小于1M
                            </div>
                        </div>
                    </div>

                    <div className="line">
                        <p className='p'>权重</p>
                        <InputNumber
                            value={priority} max={99}
                            onChange={(v) => {
                                this.setState({
                                    banner: {
                                        ...banner,
                                        priority: v
                                    }
                                })
                            }}/>
                    </div>

                    <div className="line">
                        <p className='p'>启用</p>
                        <Switch checked={status === 1} onChange={(chk) => {
                            this.setState({
                                banner: {
                                    ...banner,
                                    status: chk ? 1 : 2
                                }
                            })
                        }}/>
                    </div>
                </div>
            </div>
        </Modal>
    }
}
