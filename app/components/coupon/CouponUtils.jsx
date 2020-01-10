import React from 'react';
import CouponEdit from "./CouponEdit";
import {Utils} from "../../common";

let CouponUtils = (() => {


    let edit = (coupon, loadData) => {
        Utils.common.renderReactDOM(<CouponEdit coupon={coupon} loadData={loadData}/>);
    };

    return {
        edit,
    }

})();

export default CouponUtils;