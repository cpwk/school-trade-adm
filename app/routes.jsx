import React from 'react';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom'
import Page from './components/common/Page';
import Login from './components/login/Login';
import Dashboard from './components/dashboard/Dashboard';
import Index from './Index';
import Admins from './components/admin/Admins';
import AdminEdit from './components/admin/AdminEdit';
import Roles from './components/admin/Roles';
import RoleEdit from './components/admin/RoleEdit';
import Banners from './components/banner/Banners'
import Orders from './components/order/Orders'
import Products from "./components/product/Products";
import User from "./components/user/User";
import ProductEdit from "./components/product/ProductEdit";
import Sort from "./components/sort/Sort";
import Coupon from "./components/coupon/Coupon";
import Vip from "./components/vip/Vip";
import VipEdit from "./components/vip/VipEdit";
import VipUser from "./components/vip/VipUser";
import Comment from "./components/comment/Comment";
import Merchants from "./components/merchant/Merchants";
import MerchantEdit from "./components/merchant/MerchantEdit";

const routes = (
    <HashRouter>
        <Switch>
            <Route path='/' children={() => (
                <Page>
                    <Switch>

                        <Redirect exact from='/' to='/app/dashboard/index'/>

                        <Route path='/' exact component={Index}/>

                        <Route path='/login' exact component={Login}/>

                        <Route path='/app' children={() => (
                            <Index>

                                <Route path='/app/dashboard/index' component={Dashboard}/>

                                <Route path={'/app/info/banners'} component={Banners}/>

                                <Route path={'/app/info/sort'} component={Sort}/>

                                <Route path={'/app/info/user'} component={User}/>

                                <Route path={'/app/info/order'} component={Orders}/>

                                <Route path={'/app/info/coupon'} component={Coupon}/>

                                <Route path={'/app/comment'} component={Comment}/>

                                <Route path={'/app/info/product'} component={Products}/>
                                <Route path={'/app/info/product-edit/:id'} component={ProductEdit}/>

                                <Route path={'/app/admin/roles'} component={Roles}/>
                                <Route path={'/app/admin/role-edit/:id'} component={RoleEdit}/>

                                <Route path={'/app/admin/admins'} component={Admins}/>
                                <Route path={'/app/admin/admin-edit/:id'} component={AdminEdit}/>

                                <Route path={'/app/info/vip'} component={Vip}/>
                                <Route path={'/app/info/vip-edit/:id'} component={VipEdit}/>
                                <Route path={'/app/info/vip-user'} component={VipUser}/>

                                <Route path={'/app/merchant/merchants'} component={Merchants}/>
                                <Route path={'/app/merchant/merchant-edit/:id'} component={MerchantEdit}/>
                            </Index>
                        )}/>

                    </Switch>
                </Page>
            )}>
            </Route>
        </Switch>
    </HashRouter>
);


export default routes;
