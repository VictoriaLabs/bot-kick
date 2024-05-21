
import { HttpsProtocol } from "../../requestsFaker/Protocol";
import Requests from "../../requestsFaker/Requests.json";

export const runtimeChannelData = new Map<number, string>();

export const bannedChannels = (()=>{
  let banList = ["VictoriaLabs"]
  // You can make an http request to get the list of banned channels from the core
  return banList;
})()

export const getChannelData = async (channel: string) => {
  const request = Requests.get_channel_info;
  const api = new HttpsProtocol(request.url+channel, request.options);
  const response = await api.httpsFetcher();
  const jsonContent = await response.json();
  runtimeChannelData.set(jsonContent.chatroom.id, jsonContent.slug);
  return jsonContent;
};

export const getChatroomId = async (channels: string[]) => {
  let chatroomIds: number[] = [];
  for (const channel of channels) {
    const channelData = await getChannelData(channel);
    const chatRoomId = channelData.chatroom.id;
    chatroomIds.push(chatRoomId);
  }
  
  return chatroomIds;
};
