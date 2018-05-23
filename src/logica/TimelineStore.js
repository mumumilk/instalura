import PubSub from 'pubsub-js';

export default class TimelineStore{
    constructor(fotos){
        this.fotos = fotos;
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
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId);

                fotoAchada.comentarios.push(comentario);
                PubSub.publish('timeline', this.fotos);
            })
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
            const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;
            
                if (fotoAchada.likers.find(liker => liker.id === liker.id)) {
                    let novosLikers = fotoAchada.likers.filter(liker => liker.id !== liker.id);
                    fotoAchada.likers = novosLikers;
                } else {
                    let novosLikers = fotoAchada.likers.concat(liker);
                    fotoAchada.likers = novosLikers;
                }

            PubSub.publish('timeline', this.fotos)
        })
    }

    lista(apiUrl) {
        fetch(apiUrl)
        .then((response) => response.json())
        .then((fotos) => {
            this.fotos = fotos;
            PubSub.publish('timeline', this.fotos);
        })
    }

    subscribe(callback) {
        PubSub.subscribe('timeline', (topico, fotos) => {
            callback(fotos);
        });
    }
}