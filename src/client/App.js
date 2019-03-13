import React, { Component } from 'react';
import CompanySelectPanel from './components/CompanySelectPanel';

//CSS IMPORTS
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/custom.css';

export default class App extends Component {
    render() {
        return (
            <div id="content-wrapper">
                <a href="https://lendesk.com" id="logo">Lendesk</a>
                
                <CompanySelectPanel />
            </div>
        );
    }
}
