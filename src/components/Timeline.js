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

        PubSub.subscribe('timeline', (topico, fotos) => {
            this.setState({ fotos });
        })

        PubSub.subscribe('like', (topic, likerInfo) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === likerInfo.fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;
            
                if (fotoAchada.likers.find(liker => liker.id === likerInfo.liker.id)) {
                    let novosLikers = fotoAchada.likers.filter(liker => liker.id !== likerInfo.liker.id);
                    fotoAchada.likers = novosLikers;
                } else {
                    let novosLikers = fotoAchada.likers.concat(likerInfo.liker);
                    fotoAchada.likers = novosLikers;
                }

                this.setState({fotos: this.state.fotos });
            
        });

        PubSub.subscribe('comentario', (topic, comentarioInfo) => {
            const fotoAchada = this.state.fotos.find(foto => foto.id === comentarioInfo.fotoId);

            fotoAchada.comentarios.push(comentarioInfo.comentario);
            this.setState({fotos: this.state.fotos});
        })
    }

    carregaFotos() {
        let apiUrl = '';
        if (this.login) {
            apiUrl = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`
        } else {
            apiUrl = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`
        }

        fetch(apiUrl)
            .then((response) => response.json())
            .then((fotos) => {
                this.setState({ fotos: fotos });
            })
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        this.login = nextProps.match.params.login;
        this.carregaFotos();
    }

    like(fotoId) {
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).catch(() => {
            throw new Error('não foi possível likear a foto');
        })
        .then((liker) => {
            PubSub.publish('like', {
                liker,
                fotoId
            })
        })
    }

    comenta(fotoId, textoComentario) {
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({texto: textoComentario}),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }

        fetch(`https://instalura-api.herokuapp.com/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            }).catch(() => {
                throw new Error('não foi possível comentar a foto');
            })
            .then((comentario) => {
                PubSub.publish('comentario', {
                    comentario,
                    fotoId
                })
            })
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
                            this.state.fotos.map(foto => <Foto key={foto.id} foto={foto} like={this.like} comenta={this.comenta}/>)
                        }
                    </CSSTransitionGroup>

                </div>
            </div>
        );
    }
}

export default withRouter(Timeline);