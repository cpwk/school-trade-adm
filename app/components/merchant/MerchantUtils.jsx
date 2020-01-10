import React from 'react';
import {Utils} from "../../common";
import MerchantDetail from "./MerchantDetail";
import MerchantRenew from "./MerchantRenew";
import MerchantAdminAdd from "./MerchantAdminAdd";
import MerchantAdminPwd from "./MerchantAdminPwd";

let MerchantUtils = (() => {

    let currentMerchantPageKey = 'key-merchant-pageno';

    let setMerchantCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentMerchantPageKey, pageno);
    };

    let getMerchantCurrentPage = () => {
        return Utils._getCurrentPage(currentMerchantPageKey);
    };

    let merchantDetail = (merchantId, index, syncMerchant) => {
        Utils.common.renderReactDOM(<MerchantDetail merchantId={merchantId} index={index}
                                                    syncMerchant={syncMerchant}/>);
    };

    let merchantRenew = (merchant, loadMerchant) => {
        Utils.common.renderReactDOM(<MerchantRenew merchant={merchant} loadMerchant={loadMerchant}/>);
    };

    let merchantAdminAdd = (merchant) => {
        Utils.common.renderReactDOM(<MerchantAdminAdd merchant={merchant}/>);
    };

    let merchantAdminPwd = (admin) => {
        Utils.common.renderReactDOM(<MerchantAdminPwd admin={admin}/>);
    };

    return {
        setMerchantCurrentPage, getMerchantCurrentPage,
        merchantDetail, merchantRenew, merchantAdminAdd, merchantAdminPwd
    }

})();

export default MerchantUtils;