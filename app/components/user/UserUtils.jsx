import React from 'react';
import UserSessions from "./UserSessions";
import {Utils} from "../../common";

let UserUtils = (() => {

    let userSessions = (userId) => {
        Utils.common.renderReactDOM(<UserSessions userId={userId}/>);
    };

    return {
        userSessions
    }

})();

export default UserUtils;