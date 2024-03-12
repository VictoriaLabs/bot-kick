// import { client } from "./kickchat-client/index";
import { getChatroomId } from "./kickchat-client/utils/index";
import Client from "./requestsFaker/KickClient";
import Requests from "./requestsFaker/Requests.json";
const coockieCache = require("./requestsFaker/coockieCache.json");

const chatRoom = "djafslayer"
// client([chatRoom]);

let kickClient = new Client(Requests.connexion_request_list,coockieCache);

kickClient.Connect().then(async () => {
    let chatRoomId = await getChatroomId([chatRoom]);
    kickClient.SendMessages("test", Requests.send_message, chatRoom, chatRoomId[0]);}
);
