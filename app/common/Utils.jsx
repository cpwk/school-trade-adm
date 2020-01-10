import NProgress from 'nprogress';
import React from 'react';
import ReactDOM from 'react-dom';
import DialogQRCode from "../components/common/DialogQRCode";
import {CTYPE, KvStorage} from "./index";
import ImgLightbox from "./ImgLightbox";
import ImgEditor from "./ImgEditor";
import {ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

let Utils = (function () {


    let _setCurrentPage = (key, pageno) => {
        sessionStorage.setItem(key, pageno);
    };

    let _getCurrentPage = (key) => {
        return sessionStorage.getItem(key) ? parseInt(sessionStorage.getItem(key)) : 1
    };

    let _setTabIndex = (key, index) => {
        sessionStorage.setItem(key, index);
    };

    let _getTabIndex = (tabKey) => {
        return sessionStorage.getItem(tabKey) ? parseInt(sessionStorage.getItem(tabKey)) : 0
    };

    let _setTabKey = (key, v) => {
        sessionStorage.setItem(key, v);
    };

    let _getTabKey = (tabKey) => {
        return sessionStorage.getItem(tabKey);
    };

    let parseDay = (duration) => {
        const day = [{key: 'D', label: '天'},
            {key: 'M', label: '个月'},
            {key: 'H', label: '小时'},
            {key: 'Y', label: '年'}];
        var str = duration.substr(duration.length - 1, 1);
        let day1 = day.find(d => d.key === str);
        let {label} = day1;
        var s = duration.substr(0, duration.length - 1);
        var res = s + label;
        return res
    };

    let nProgress = (() => {
        NProgress.configure({showSpinner: false});
        return {
            start: () => {
                NProgress.start();
            },
            done: () => {
                NProgress.done();
            },
        }
    })();

    let qrcode = (() => {

        let show = (url, avatar, title, copyStr) => {
            common.renderReactDOM(<DialogQRCode url={url} avatar={avatar} title={title} copyStr={copyStr}/>);
        };

        return {show}
    })();

    let common = (() => {

        let renderReactDOM = (child, options = {}) => {

            let div = document.createElement('div');
            let {id} = options;
            if (id) {
                let e = document.getElementById(id);
                if (e) {
                    document.body.removeChild(e);
                }
                div.setAttribute('id', id);
            }
            document.body.appendChild(div);
            ReactDOM.render(<ConfigProvider locale={zhCN}>{child}</ConfigProvider>, div);
        };

        let closeModalContainer = (id_div) => {
            let e = document.getElementById(id_div);
            if (e) {
                document.body.removeChild(e);
            }
        };

        let createModalContainer = (id_div) => {
            //强制清理同名div，render会重复创建modal
            closeModalContainer(id_div);
            let div = document.createElement('div');
            div.setAttribute('id', id_div);
            document.body.appendChild(div);
            return div;
        };

        let showImgLightbox = (images, index) => {
            common.renderReactDOM(<ImgLightbox images={images} index={index} show={true}/>);
        };

        let showImgEditor = (aspectRatio, img, syncImg) => {
            common.renderReactDOM(<ImgEditor aspectRatio={aspectRatio} img={img}
                                             syncImg={syncImg}/>, {id: 'div-img-editor'});
        };


        return {
            renderReactDOM, closeModalContainer, createModalContainer, showImgLightbox, showImgEditor
        }
    })();

    let adminPermissions = null;

    let adm = (() => {

        let avatar = (img) => {
            return img ? img : require('../assets/image/common/logo_square.png');
        };

        let savePermissions = (permissions) => {
            KvStorage.set('admin-permissions', permissions);
            initPermissions();
        };

        let getPermissions = () => {
            return KvStorage.get('admin-permissions') || '';
        };

        let authPermission = (f) => {
            return getPermissions().includes(f);
        };

        let initPermissions = () => {
            if (getPermissions() === '') {
                return;
            }
            Utils.adminPermissions = {
                ROLE_EDIT: authPermission('ROLE_EDIT'),
                ADMIN_EDIT: authPermission('ADMIN_EDIT'),
                ADMIN_LIST: authPermission('ADMIN_LIST'),
                BANNER_EDIT: authPermission('BANNER_EDIT'),
                PRODUCT_EDIT: authPermission('PRODUCT_EDIT'),
                SORT_EDIT: authPermission('SORT_EDIT'),
                USER_EDIT: authPermission('USER_EDIT'),
                ORDER_EDIT: authPermission('ORDER_EDIT'),
                SORT_REMOVE: authPermission('SORT_REMOVE'),
                COUPON_EDIT: authPermission('COUPON_EDIT'),
                VIP_EDIT: authPermission('VIP_EDIT'),
                COMMENT_EDIT: authPermission('COMMENT_EDIT'),
                MERCHANT_LIST: authPermission('MERCHANT_LIST'),
                MERCHANT_EDIT: authPermission('MERCHANT_EDIT'),
                MERCHANT_RENEW: authPermission('MERCHANT_RENEW'),
            }
        };

        let clearPermissions = () => {
            Utils.adminPermissions = null;
            KvStorage.remove('admin-permissions');
        };

        return {avatar, savePermissions, initPermissions, clearPermissions}

    })();

    let num = (() => {

        let formatPrice = value => {
            value += '';
            const list = value.split('.');
            const prefix = list[0].charAt(0) === '-' ? '-' : '';
            let num = prefix ? list[0].slice(1) : list[0];
            let result = '';
            while (num.length > 3) {
                result = `,${num.slice(-3)}${result}`;
                num = num.slice(0, num.length - 3);
            }
            if (num) {
                result = num + result;
            }
            return `¥ ${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
        };

        return {
            formatPrice
        }

    })();

    let pager = (() => {

        let convert2Pagination = (result) => {

            let {pageable = {}, totalElements} = result;

            let pageSize = pageable.pageSize || CTYPE.pagination.pageSize;
            let current = pageable.pageNumber + 1;

            return {
                current,
                total: totalElements,
                pageSize
            }
        };

        return {convert2Pagination}

    })();

    return {
        common, adm, num, pager, nProgress, qrcode, adminPermissions,
        _setCurrentPage, _getCurrentPage, _setTabIndex, _getTabIndex, _setTabKey, _getTabKey, parseDay
    };

})
();

export default Utils;
