import React, { Component } from 'react';
import Foto from './Foto';
import { withRouter } from "react-router-dom";

export class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fotos: []
        }
    }

    componentWillMount() {
        if (!localStorage.getItem('auth-token')) {
            this.props.history.push('/?msg=precisa estar logado');
        }
    }

    componentDidMount() {
        fetch(`https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`)
            .then((response) => response.json())
            .then((fotos) => {
                this.setState({ fotos: fotos });
            })
    }

    render() {
        return (
            <div>
                <div className="fotos container">
                    {
                        this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} />)
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Timeline);