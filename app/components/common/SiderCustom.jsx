import React, {Component} from 'react';
import {Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import CTYPE from "../../common/CTYPE";
import {Utils} from "../../common";

const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
        firstHide: false
    };

    componentDidMount() {
        this.setMenuOpen();
    }

    componentWillReceiveProps(nextProps) {
        this.onCollapse(nextProps.collapsed);
    }

    getPostion = (str, cha, num) => {
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    };

    setMenuOpen = () => {

        let path = window.location.hash.split('#')[1];

        //兼容三层目录,三级页不修改，刷新时定位到一级
        let key = path.substr(0, path.lastIndexOf('/'));
        if (key.split('/').length > 3) {
            if (this.state.openKey)
                return;
            key = key.substring(0, this.getPostion(key, '/', 2));
        }

        this.setState({
            openKey: key,
            selectedKey: path
        });
    };

    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
            firstHide: collapsed,
            mode: collapsed ? 'vertical' : 'inline'
        });
    };

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });

    };
    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false
        })
    };

    render() {

        let {ADMIN_LIST, ROLE_EDIT, BANNER_EDIT, PRODUCT_EDIT, ORDER_EDIT, SORT_EDIT, USER_EDIT, COUPON_EDIT, VIP_EDIT, COMMENT_EDIT, MERCHANT_LIST} = Utils.adminPermissions;

        let {firstHide, selectedKey, openKey} = this.state;

        let withMerchant = MERCHANT_LIST;


        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}>
                <div className={this.props.collapsed ? 'logo logo-s' : 'logo'}/>
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    openKeys={firstHide ? null : [openKey]}
                    onOpenChange={this.openMenu}>
                    <Menu.Item key="/app/dashboard/index">
                        <Link to={'/app/dashboard/index'}><Icon type="home"/><span
                            className="nav-text">首页</span></Link>
                    </Menu.Item>

                    {withMerchant && <SubMenu key='/app/merchant'
                                              title={<span><Icon type="shop"/><span
                                                  className="nav-text">店铺管理</span></span>}>
                        <Menu.Item key={CTYPE.link.merchant_merchants.key}><Link
                            to={CTYPE.link.merchant_merchants.path}>{CTYPE.link.merchant_merchants.txt}</Link></Menu.Item>
                    </SubMenu>}

                    {BANNER_EDIT && <SubMenu
                        key='/banner'
                        title={<span><Icon type="picture"/><span className="nav-text">banner管理</span></span>}>
                        {BANNER_EDIT && <Menu.Item key={CTYPE.link.info_banners.key}><Link
                            to={CTYPE.link.info_banners.path}>{CTYPE.link.info_banners.txt}</Link></Menu.Item>}
                    </SubMenu>}

                    {USER_EDIT && <SubMenu
                        key='/user'
                        title={<span><Icon type="contacts"/><span className="nav-text">用户管理</span></span>}>

                        {USER_EDIT && <Menu.Item key={CTYPE.link.info_user.key}><Link
                            to={CTYPE.link.info_user.path}>{CTYPE.link.info_user.txt}</Link></Menu.Item>}


                    </SubMenu>}

                    {VIP_EDIT && <SubMenu
                        key='/vip'
                        title={<span><Icon type="safety-certificate"/><span className="nav-text">会员管理</span></span>}>

                        {VIP_EDIT && <Menu.Item key={CTYPE.link.vip.key}><Link
                            to={CTYPE.link.vip.path}>{CTYPE.link.vip.txt}</Link></Menu.Item>}

                        {VIP_EDIT && <Menu.Item key={CTYPE.link.vip_user.key}><Link
                            to={CTYPE.link.vip_user.path}>{CTYPE.link.vip_user.txt}</Link></Menu.Item>}

                    </SubMenu>}

                    {COUPON_EDIT && <SubMenu
                        key='/coupon'
                        title={<span><Icon type="tags"/><span className="nav-text">优惠券管理</span></span>}>

                        {COUPON_EDIT && <Menu.Item key={CTYPE.link.info_coupon.key}><Link
                            to={CTYPE.link.info_coupon.path}>{CTYPE.link.info_coupon.txt}</Link></Menu.Item>}

                    </SubMenu>}

                    {ORDER_EDIT && <SubMenu
                        key='/order'
                        title={<span><Icon type="table"/><span className="nav-text">订单管理</span></span>}>

                        {ORDER_EDIT && <Menu.Item key={CTYPE.link.info_order.key}><Link
                            to={CTYPE.link.info_order.path}>{CTYPE.link.info_order.txt}</Link></Menu.Item>}

                    </SubMenu>}

                    {COMMENT_EDIT && <SubMenu
                        key='/comment'
                        title={<span><Icon type="profile"/><span className="nav-text">评论管理</span></span>}>

                        {COMMENT_EDIT && <Menu.Item key={CTYPE.link.comment.key}><Link
                            to={CTYPE.link.comment.path}>{CTYPE.link.comment.txt}</Link></Menu.Item>}

                    </SubMenu>}

                    {(PRODUCT_EDIT || SORT_EDIT) && <SubMenu
                        key='/product'
                        title={<span><Icon type="gold"/><span className="nav-text">商品管理</span></span>}>

                        {PRODUCT_EDIT && <Menu.Item key={CTYPE.link.info_product.key}><Link
                            to={CTYPE.link.info_product.path}>{CTYPE.link.info_product.txt}</Link></Menu.Item>}

                        {SORT_EDIT && <Menu.Item key={CTYPE.link.info_sort.key}><Link
                            to={CTYPE.link.info_sort.path}>{CTYPE.link.info_sort.txt}</Link></Menu.Item>}

                    </SubMenu>}

                    {(ADMIN_LIST || ROLE_EDIT) && <SubMenu key='/admin'
                                                           title={<span><Icon type="team"/><span
                                                               className="nav-text">权限管理</span></span>}>
                        {ADMIN_LIST && <Menu.Item key={CTYPE.link.admin_admins.key}><Link
                            to={CTYPE.link.admin_admins.path}>{CTYPE.link.admin_admins.txt}</Link></Menu.Item>}

                        {ROLE_EDIT && <Menu.Item key={CTYPE.link.admin_roles.key}><Link
                            to={CTYPE.link.admin_roles.path}>{CTYPE.link.admin_roles.txt}</Link></Menu.Item>}
                    </SubMenu>}


                </Menu>
                <style>
                    {`#nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }`}
                </style>
            </Sider>
        )
    }
}

export default SiderCustom;
