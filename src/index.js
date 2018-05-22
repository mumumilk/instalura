import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/timeline.css';
import './css/login.css';
import Login from './components/Login';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
    (
        <BrowserRouter>
            <div>
                <Route exact path="/" component={Login}/>
                <Route path="/timeline/:login?" component={App}/>
            </div>
        </BrowserRouter>
    ),document.getElementById('root')
);

