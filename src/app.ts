import { client } from "./kickchat-client/index";
// import { getChannelData } from "./kickchat-client/utils/index";
// import Client from "./requestsFaker/KickClient";
// import Requests from "./requestsFaker/Requests.json";
const coockieCache = require("./requestsFaker/coockieCache.json");

const chatRoom = "triskel"

client([chatRoom]);

// let kickClient = new Client(Requests.connexion_request_list,coockieCache);

// kickClient.Connect().then(async () => {
//     const channelData = await getChannelData(chatRoom);
//     const chatRoomId = channelData.chatroom.id;
//     kickClient.SendMessages("test", Requests.send_message, chatRoom, chatRoomId);}
// );
