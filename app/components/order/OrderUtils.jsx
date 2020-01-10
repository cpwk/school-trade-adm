import Utils from "../../common/Utils";
import React from "react";
import OrderEdit from "./OrderEdit";

let OrderUtils = (() => {

    let currentPageKey = 'key-order-pageno';

    let setCurrentPage = (pageno) => {
        Utils._setCurrentPage(currentPageKey, pageno);
    };

    let getCurrentPage = () => {
        return Utils._getCurrentPage(currentPageKey);
    };
    let edit = (order, loadData) => {
        Utils.common.renderReactDOM(<OrderEdit order={order} loadData={loadData}/>);
    };
    return {
        setCurrentPage, getCurrentPage, edit
    }

})();

export default OrderUtils;