import React from 'react';
import SortEdit from "./SortEdit";
import {Utils} from "../../common";

let SortUtils = (() => {

    let editType = (type, parent, loadData) => {
        Utils.common.renderReactDOM(<SortEdit type={type} parent={parent} loadData={loadData}/>);
    };

    return {
        editType
    }

})();

export default SortUtils;