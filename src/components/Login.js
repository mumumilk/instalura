import React, { Component } from 'react';
const queryString = require('query-string');

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {msg: queryString.parse(props.location.search).msg};

        this.goToTimeline = this.goToTimeline.bind(this);

    }

    goToTimeline() {
        this.props.history.push('/timeline');
    }

    envia = e => {
        e.preventDefault();

        const requestInit = {
            method: 'POST',
            body: JSON.stringify({login:this.login.value, senha:this.senha.value}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }

        fetch('https://instalura-api.herokuapp.com/api/public/login', requestInit)
        .then(response => {
            if(response.ok) {
                return response.text();
            } else {
                throw new Error('não foi possível fazer o login');
            }
        })
        .then(token => {
            localStorage.setItem('auth-token', token);
            this.goToTimeline();
        })
        .catch(err => {
            this.setState({msg:err.message});
        })
    }

    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <span>{this.state.msg}</span>
                <form onSubmit={this.envia}>
                    <input type="text" ref={(input) => this.login = input}/>
                    <input type="password" ref={(input) => this.senha = input}/>
                    <input type="submit" value="login"/>
                </form>
            </div>
        ); 
    }
}