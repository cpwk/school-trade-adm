import React from 'react';
import {Link} from 'react-router-dom';
import {Button, Card, Form, Input, message, Tag, Transfer} from 'antd';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import App from '../../common/App.jsx';
import {CTYPE, U} from "../../common";

const FormItem = Form.Item;

export default class RoleEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: parseInt(this.props.match.params.id),
            role: {},
            permissions: [],
            selectedKeys: [],
            checkedKeys: []
        }
    }

    componentDidMount() {
        let {id} = this.state;
        App.api('adm/admin/permissions').then((permissions) => {
            permissions = permissions.filter(item => item.code !== 'NONE');
            permissions.map((k, i) => {
                k.key = k.code;
            });
            this.setState({
                permissions
            });
            if (id !== 0) {
                App.api('adm/admin/role', {id}).then((role) => {
                    this.setState({
                        permissions, role, checkedKeys: role.permissions || []
                    });
                })
            }
        })
    }

    handleSubmit = () => {

        let {role = {}, checkedKeys = []} = this.state;

        let {name} = role;
        if (U.str.isEmpty(name)) {
            message.warn('请输入名称');
            return
        }
        if (checkedKeys.length === 0) {
            message.warn('请选择权限');
            return;
        }

        role.permissions = checkedKeys;
        App.api('adm/admin/save_role', {role: JSON.stringify(role)}).then((res) => {
            window.history.back();
        });
    };

    render() {

        let {role = {}, permissions = [], checkedKeys = [], selectedKeys = []} = this.state;

        let {name} = role;

        return <div className="common-edit-page">

            <Card
                title={<BreadcrumbCustom
                    first={<Link to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link>}
                    second='编辑分组'/>}
                extra={<Button type="primary"
                               onClick={() => {
                                   this.handleSubmit()
                               }}
                               htmlType="submit">提交</Button>}
                style={CTYPE.formStyle}>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="名称">
                    <Input value={name} style={{width: '300px'}} onChange={(e) => {
                        this.setState({
                            role: {
                                ...role,
                                name: e.target.value
                            }
                        })
                    }}/>
                </FormItem>

                <FormItem
                    {...CTYPE.formItemLayout}
                    label="权限">
                    <Transfer
                        listStyle={{
                            width: 220,
                            height: 500,
                        }}
                        dataSource={permissions}
                        titles={['全部权限', '已选权限']}
                        targetKeys={checkedKeys}
                        selectedKeys={selectedKeys}
                        onChange={(nextTargetKeys, direction, moveKeys) => {
                            this.setState({checkedKeys: nextTargetKeys});
                        }}
                        onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
                            this.setState({selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]});
                        }}
                        render={item => <Tag color={item.level}>{item.name}</Tag>}/>
                </FormItem>
            </Card>
        </div>
    }
}