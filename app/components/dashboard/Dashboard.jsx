import React from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import '../../assets/css/home/home.less'
import {U} from "../../common";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        U.setWXTitle('首页');
    }

    render() {

        return (
            <div className="gutter-example button-demo">
                <BreadcrumbCustom/>

                <div className='home-page'>
                </div>

            </div>
        )
    }
}

export default Dashboard;
