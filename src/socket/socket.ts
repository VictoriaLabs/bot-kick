require('dotenv').config();

export const socket = require('socket.io-client')(process.env.WEBSOCKET_URL);
onEvent('connect', () => {
    console.log('Connecté au serveur WebSocket');
    socket.emit('join', "victoria")
});

onEvent('receiveMessage', (data : any) => {
    console.log(data);
});

export function emitEvent(eventName : string|undefined, data : any = null) {
    if (socket.connected)
        socket.emit(eventName, data);
    else
        console.log('Le socket n\'est pas connecté.');
};

export function onEvent(eventName : string, callback : Function) {
    socket.on(eventName, callback);
};

export function offEvent(eventName : string) {
    socket.off(eventName);
};

export function disconnect() {
    socket.disconnect();
    console.log('Déconnecté du serveur WebSocket');
};
