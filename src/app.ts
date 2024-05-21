import { client, closeClient } from "./kickchat-client/index";
import { getChannelData } from "./kickchat-client/utils/index";
import Client from "./requestsFaker/KickClient";
import Requests from "./requestsFaker/Requests.json";
import { offEvent, onEvent } from "./socket/socket";
const coockieCache = require("./requestsFaker/coockieCache.json");


onEvent('start', async (data : any) => {
    console.log('start-listening');
    if (!data.kick) return;

    const chatRoom = data.kick;
    const channelData = await getChannelData(chatRoom);
    const chatRoomId = channelData.chatroom.id;
    
    client([chatRoom]);
    
    let kickClient = new Client(Requests.connexion_request_list,coockieCache);
    
    kickClient.Connect().then(async () => {
        onEvent('receiveMessage', (message : any) => {
            const formatedMessage = "["+message.username+"] : " + message.message
            console.log(formatedMessage)
            kickClient.SendMessages(formatedMessage, Requests.send_message, chatRoom, chatRoomId);
        });
    });
});

onEvent('stop', (data : any) => {
    console.log('stop-listening');
    closeClient();
    offEvent('receiveMessage');
});