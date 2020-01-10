import React from 'react';
import BannerEdit from "./BannerEdit";
import {Utils} from "../../common";

let BannerUtils = (() => {

    let edit = (banner, loadData) => {
        Utils.common.renderReactDOM(<BannerEdit banner={banner} loadData={loadData}/>);
    };

    return {
        edit
    }

})();

export default BannerUtils;