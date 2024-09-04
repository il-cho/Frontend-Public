import api from "../auth/Api.js";

// 채팅 유저 정보 API
export const getChatUserInfo = async (user) => {
  try {
    const res = await api.post(`/user/chat`, { chatUserList: user });
    const { data } = res;
    return data;
  } catch (error) {
    console.error("채팅 유저 정보 가져오기 실패", error);
    throw error;
  }
};

// 채팅 내역 조회
export const getChatHistory = async (invitationCode, chattId) => {
  try {
    const res = await api.get(`/chat/history?invitationCode=${invitationCode}&chatId=${chattId}`);
    const { data } = res;
    return data;
  } catch (error) {
    console.error("채팅 내역 조회 실패", error);
    throw error;
  }
};

// 채팅방 유저 정보 조회
export const getChatUser = async (invitationCode) => {
  try {
    const res = await api.get(`/chat/userinfo/${invitationCode}`);
    const { data } = res;
    return data;
  } catch (error) {
    console.error("채팅방 유저 정보 조회 실패", error);
    throw error;
  }
};

// // 채팅 전송
// export const sendChat = async (invitationCode, senderId, content) => {
//   try {
//     const res = await api.ws(`/ws/${invitationCode}`, {
//       invitationCode: invitationCode,
//       senderId: senderId,
//       content: content,
//     });
//     const { data } = res;
//     return data;
//   } catch (error) {
//     console.error("채팅 전송 실패", error);
//     throw error;
//   }
// };

// WebSocket을 사용한 채팅 전송
export const sendChat = (stompClient, invitationCode, senderId, content) => {
  if (stompClient && stompClient.connected) {
    const message = {
      invitationCode: invitationCode,
      senderId: senderId,
      content: content,
    };
    stompClient.send(`/ws/${invitationCode}`, {}, JSON.stringify(message));
  } else {
    console.error("WebSocket이 연결되어 있지 않습니다.");
  }
};
