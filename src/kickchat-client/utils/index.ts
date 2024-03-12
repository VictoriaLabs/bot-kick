
import { HttpsProtocol } from "../../requestsFaker/Protocol";
import Requests from "../../requestsFaker/Requests.json";

export const getChannelData = async (channel: string) => {
  const request = Requests.get_channel_info;
  const api = new HttpsProtocol(request.url+channel, request.options);
  const response = await api.httpsFetcher();
  const jsonContent = await response.json();
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
