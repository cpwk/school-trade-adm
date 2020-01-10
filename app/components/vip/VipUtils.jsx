import React from 'react';
import {Utils} from "../../common";
import VipBuy from "./VipBuy";
import VipRenew from './VipRenew';

let VipUtils = (() => {

    let BuyVip = () => {
        Utils.common.renderReactDOM(<VipBuy/>);
    };

    let vipRenew = (id, loadData) => {
        Utils.common.renderReactDOM(<VipRenew id={id} loadData={loadData}/>);
    };

    return {
        BuyVip, vipRenew
    }

})();

export default VipUtils;