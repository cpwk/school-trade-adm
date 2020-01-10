import React from 'react'
import {App, U, Utils} from '../../common'
import {Button, Card, Icon, message, Modal, notification, Tree} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom'
import CTYPE from "../../common/CTYPE";
import '../../assets/css/common/common-list.less'
import SortUtils from "./SortUtils";

const {TreeNode} = Tree;

export default class Sort extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    componentDidMount() {
        U.setWXTitle('商品类型管理');
        this.loadData();
    }

    loadData = () => {
        App.api('adm/sort/sorts').then((list) => {
            this.setState({list});
        });
    };

    status = (id, status) => {
        let txt = status === 1 ? '禁用' : '启用';
        Modal.confirm({
            title: `确认${txt}?`,
            onOk: () => {
                App.api('adm/sort/status', {id, status: status === 1 ? 2 : 1}).then(() => {
                    notification['success']({
                        message: '提示',
                        description: `${txt} 成功`,
                    });
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    remove = (id) => {
        Modal.confirm({
            title: `确认删除操作?此操作将删除分类下所有单选题和材料`,
            onOk: () => {
                App.api('adm/sort/remove', {id}).then(() => {
                    message.success(`操作成功`);
                    this.loadData();
                })
            },
            onCancel() {
            },
        });
    };

    renderTitle = (type, parent, level, index) => {
        let {SORT_REMOVE} = Utils.adminPermissions;
        let {id, name, priority, status, children = []} = type;
        let on = status === 1;
        type.level = level;
        type.index = index;
        return <span style={{color: on ? 'black' : 'gray'}}>
            [{priority}]{name}
            &nbsp;
            <a title='编辑分类' onClick={() => {
                SortUtils.editType(type, parent, this.loadData);
            }}><Icon type='edit'/></a>
            {level !== 3 && <span>&nbsp;
                <a title='新建子分类' onClick={() => {
                    SortUtils.editType({
                        id: 0,
                        level: level + 1,
                        index: children.length + 1
                    }, type, this.loadData);
                }}><Icon type='file-add' theme="twoTone" twoToneColor="#91d5ff"/></a>
            </span>}
            &nbsp;
            <a onClick={() => {
                this.status(id, status);
            }}>{on ? <Icon type='stop' theme="twoTone" twoToneColor="#ffa39e"/> :
                <Icon type='check-circle' theme="twoTone" twoToneColor="#b7eb8f"/>}</a>
            &nbsp;
            {SORT_REMOVE && <a onClick={() => {
                this.remove(id);
            }}><Icon type='delete' theme="twoTone" twoToneColor="#ff0000"/></a>}

        </span>;
    };

    render() {

        let {list = []} = this.state;

        return <div className="common-list">
            <BreadcrumbCustom first={CTYPE.link.info_sort.txt}/>

            <Card bordered={false} extra={<Button type="primary" icon="file-add" onClick={() => {
                SortUtils.editType({id: 0, level: 1, index: list.length + 1}, {id: 0}, this.loadData);
            }}>新建一级分类</Button>}>

                {list.length > 0 && <Tree defaultExpandAll showLine>
                    {list.map((t1, index1) => {
                        let {children = []} = t1;
                        return <TreeNode title={this.renderTitle(t1, {id: 0}, 1, index1 + 1)} key={`${index1}`}>

                            {children.map((t2, index2) => {
                                let {children = []} = t2;
                                return <TreeNode title={this.renderTitle(t2, t1, 2, index2 + 1)}
                                                 key={`${index1}-${index2}`}>

                                    {children.map((t3, index3) => {
                                        return <TreeNode title={this.renderTitle(t3, t2, 3, index3 + 1)}
                                                         key={`${index1}-${index2}-${index3}`}/>
                                    })}
                                </TreeNode>
                            })}
                        </TreeNode>
                    })}
                </Tree>}
            </Card>
        </div>
    }
}
