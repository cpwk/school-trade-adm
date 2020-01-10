import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css'
import routers from './routes';

if (module.hot)
    module.hot.accept();

ReactDOM.render(routers, document.getElementById('root'));