import React from 'react'
import App from '../../common/App.jsx'
import U from '../../common/U.jsx'
import Utils from '../../common/Utils.jsx'
import {Modal, Table} from 'antd';
import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'

const id_div = 'div-dialog-loginlogs';

export default class UserSessions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            userId: this.props.userId,
            pagination: {
                pageSize: CTYPE.pagination.pageSize,
                current: 0,
                total: 0
            },
            loading: false
        };
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {

        this.setState({loading: true});

        let {userId, pagination = {}} = this.state;

        Utils.nProgress.start();
        App.api('/user/user_session', {
            userSessionQo: JSON.stringify({
                userId,
                pageNumber: pagination.current,
                pageSize: pagination.pageSize
            })
        }).then((result) => {
            Utils.nProgress.done();
            let {content = []} = result;
            let pagination = Utils.pager.convert2Pagination(result);
            this.setState({
                list: content,
                pagination,
                loading: false
            });
        });
    };

    handleTableChange = (pagination) => {
        this.setState({
            pagination: pagination
        }, () => this.loadData());
    };

    render() {

        let {list = [], pagination = {}, loading} = this.state;

        return <Modal title={'登录日志'}
                      getContainer={() => Utils.common.createModalContainer(id_div)}
                      visible={true}
                      footer={null}
                      width={'1000px'}
                      onCancel={() => Utils.common.closeModalContainer(id_div)}>
            <div className='modal-scroll-500'>

                <div className='inner'>
                    <Table dataSource={list} rowKey={record => record.id} size='small'
                           pagination={{...pagination, ...CTYPE.commonPagination}}
                           loading={loading}
                           onChange={this.handleTableChange}
                           columns={[{
                               title: '序号',
                               dataIndex: 'index',
                               className: 'txt-center',
                               width: '60px',
                               render: (obj, item, index) => {
                                   return <span>{index + 1}</span>
                               }
                           },
                               {
                                   title: '用户Id',
                                   dataIndex: 'userId',
                                   className: 'txt-center',
                                   width: '50px'
                               },
                               {
                                   title: '登录时间',
                                   dataIndex: 'signInAt',
                                   className: 'txt-center',
                                   width: '140px',
                                   render: (signInAt) => {
                                       return U.date.format(new Date(signInAt), 'yyyy-MM-dd HH:mm')
                                   }
                               },
                               {
                                   title: '失效时间',
                                   dataIndex: 'expireAt',
                                   className: 'txt-center',
                                   width: '140px',
                                   render: (expireAt) => {
                                       return U.date.format(new Date(expireAt), 'yyyy-MM-dd HH:mm')
                                   }
                               },
                               {
                                   title: '登录IP',
                                   dataIndex: 'ip',
                                   className: 'txt-center',
                                   width: '120px'
                               }]}/>
                </div>
            </div>
        </Modal>
    }
}
