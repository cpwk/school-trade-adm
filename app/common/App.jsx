import {message} from 'antd';
import KvStorage from './KvStorage.jsx';
import {U, Utils} from "./index";

const hashHistory = require('history').createHashHistory();

let ENV_CONFIG;
if (process.env.API_ENV == 'dev') {
    ENV_CONFIG = require('./env/dev').default;
}

if (process.env.API_ENV == 'sandbox') {
    ENV_CONFIG = require('./env/sandbox').default;
}

if (process.env.API_ENV == 'prod') {
    ENV_CONFIG = require('./env/prod').default;
}

const API_BASE = window.location.protocol + ENV_CONFIG.api;

let saveCookie = (k, v) => KvStorage.set(k, v);
let getCookie = (k) => KvStorage.get(k);
let removeCookie = (k) => KvStorage.remove(k);

const go = function (hash) {
    hashHistory.push(hash);
};

let logout = () => {
    removeCookie('admin-token');
    removeCookie('admin-profile');
    Utils.adm.clearPermissions();
};

const api = (path, params, options) => {
    params = params || {};
    options = options || {};

    if (options.requireSession === undefined) {
        options.requireSession = true;
    }
    if (options.defaultErrorProcess === undefined) {
        options.defaultErrorProcess = true;
    }

    let defaultError = {'errcode': 600, 'errmsg': '网络错误'};
    let apiPromise = function (resolve, reject) {
        let rejectWrap = reject;

        if (options.defaultErrorProcess) {
            rejectWrap = function (ret) {
                let {errmsg} = ret;
                message.error(errmsg);
                reject(ret);
            };
        }
        var apiUrl = API_BASE + path;

        var sessionId = getCookie('admin-token');
        if (U.str.isNotEmpty(sessionId)) {
            params['admin-token'] = sessionId;
        }

        let dataStr = '';
        for (let key in params) {
            if (dataStr.length > 0) {
                dataStr += '&';
            }
            if (params.hasOwnProperty(key)) {
                let value = params[key];
                if (value === undefined || value === null) {
                    value = '';
                }
                dataStr += (key + '=' + encodeURIComponent(value));
            }
        }
        if (dataStr.length == 0) {
            dataStr = null;
        }

        fetch(apiUrl, {
            method: 'POST',
            body: dataStr,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response) {
            response.json().then(function (ret) {
                var errcode = ret.errcode;
                if (errcode) {
                    if (errcode === 5) {
                        //登录会话过期
                        message.warn('请重新登录');
                        logout();
                        go('/login');
                        return;
                    }
                    rejectWrap(ret);
                    return;
                }
                resolve(ret.result);
            }, function () {
                rejectWrap(defaultError);
            });
        }, function () {
            rejectWrap(defaultError);
        }).catch(() => {
        })
    };

    return new Promise(apiPromise);

};


let getAdmProfile = function () {
    return JSON.parse(getCookie('admin-profile') || '{}');
};

export default {
    go, api, API_BASE, logout, getAdmProfile
};
