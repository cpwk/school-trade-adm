import React from 'react';
import {Avatar, Form, Icon, Layout, Menu, Modal} from 'antd';

import App from '../../common/App.jsx';
import AdminUtils from "../admin/AdminUtils";
import AdminProfile from "../admin/AdminProfile";

const {Header} = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class HeaderCustom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            profile: {}
        };
    }

    componentDidMount() {
        AdminProfile.get().then((profile) => {
            this.setState({profile});
        });
    }


    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        this.props.toggle && this.props.toggle();
    };

    logout = () => {
        Modal.confirm({
            title: '确定要退出吗?',
            content: null,
            onOk() {
                App.logout();
                App.go('/login');
            },
            onCancel() {
            },
        });
    };

    render() {

        let {profile = {}} = this.state;
        let {admin = {}} = profile;
        let {avatar} = admin;
        return (
            <Header style={{background: '#424242', padding: 0, height: 65}}>
                <Icon
                    className="trigger custom-trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleCollapsed}/>

                <Menu className='header-top-bar'
                      mode="horizontal" style={{lineHeight: '64px', float: 'right'}}>
                    <SubMenu
                        title={<Avatar size={40} src={avatar}/>}>
                        <MenuItemGroup title="用户中心">
                            <Menu.Item key="pwd"><span onClick={AdminUtils.modAdminPwd}>修改密码</span></Menu.Item>
                            <Menu.Item key="logout"><span onClick={this.logout}>退出登录</span></Menu.Item>
                        </MenuItemGroup>
                    </SubMenu>
                </Menu>

                <style>{`
                    .ant-menu-submenu-horizontal{
                        background:#444;
                        border-bottom:none !important;
                    }
                    .ant-menu-submenu-horizontal > .ant-menu {
                        width: 120px;
                        left: -40px;
                    }
                `}</style>
            </Header>
        )
    }
}

export default Form.create()(HeaderCustom);