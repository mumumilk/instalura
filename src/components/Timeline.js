import React, { Component } from 'react';
import Foto from './Foto';
import { withRouter } from "react-router-dom";
import PubSub from 'pubsub-js';
import { CSSTransitionGroup } from 'react-transition-group';

export class Timeline extends Component {

    constructor(props) {
        super(props);

        this.login = this.props.match.params.login;

        this.state = {
            fotos: []
        }

    }

    componentWillMount() {
        if (!this.login && !localStorage.getItem('auth-token')) {
            this.props.history.push('/?msg=precisa estar logado');
        }

        this.props.store.subscribe(fotos => {
            this.setState({fotos});
        });
    }

    carregaFotos() {
        let apiUrl = '';
        if (this.login) {
            apiUrl = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`
        } else {
            apiUrl = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
        }

        this.props.store.lista(apiUrl);
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        this.login = nextProps.match.params.login;
        this.carregaFotos();
    }

    like(fotoId) {
        this.props.store.like(fotoId);
    }

    comenta(fotoId, textoComentario) {
        this.props.store.comenta(fotoId, textoComentario)
    }

    render() {
        return (
            <div>
                <div className="fotos container">
                    <CSSTransitionGroup
                        transitionName="timeline"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={300}>
                        {
                            this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)}/>)
                        }
                    </CSSTransitionGroup>

                </div>
            </div>
        );
    }
}

export default withRouter(Timeline);