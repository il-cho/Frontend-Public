import { wrapPromise } from "../promise/wrapPromise.js";

import api from "../auth/Api.js";

//챗봇 질문
export const chatbot = async (invitationCode, prompt) => {
    try {
        const res = await api.post(`/chatbot/prompt/${invitationCode}`,{
            prompt: prompt
        });
        const { data } = res;
        return data;
    } catch (error) {
        console.error("Gemini 질문 실패", error);
        throw error;
    }
};

//챗봇 정보 생성
export const createInvitationPrompt = async (invitationCode, title, description, inviter) => {
    const getDetail = async () => {
        const asyncDetail = await api.post(`/chatbot/invitation`, {
            invitation: {
                invitationCode,
                title,
                description,
                inviter,
                confirmedDate: null,
                attendees: null,
            }
        }).then((res) => {
            const { data } = res;
            return data;
        });
        return asyncDetail;
    };

    const data = await getDetail();
    return {
        data,
    };
};


//초대장 수정 API
export const modifyInvitationPrompt = (
    invitationCode, title, description, inviter, confirmedDate, attendees
) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .put(`/invitation/${invitationCode}`, {
                invitation: {
                    inviter,
                    invitationCode,
                    title,
                    description,
                    confirmedDate,
                    attendees,
                }
            })
            .then((res) => {
                const { data } = res;
                const { invitation } = data;
                return invitation;
            });
        return asyncDetail;
    };
    return {
        detail: wrapPromise(getDetail()),
    };
};

//초대장 삭제 API
export const deleteInvitationPrompt = async (invitationCode) => {
    const getDetail = async () => {
        const asyncDetail = await api.delete(`/chatbot/invitation/${invitationCode}`).then((res) => {
            const { data } = res;
            const { row } = data;
            return row;
        });
        return asyncDetail;
    };
    
    const data = await getDetail();

    return {
        data
    };
};

//일정 수정 API
export const modifySchedulePrompt = (
    invitationCode, startDate, endDate, possibleDate, isConfirmed
) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .put(`/chatbot/schedule/${invitationCode}`, {
                schedule: {
                    startDate,
                    endDate,
                    possibleDate,
                    isConfirmed,
                }
            })
            .then((res) => {
                const { data } = res;
                const { invitation } = data;
                return invitation;
            });
        return asyncDetail;
    };
    return {
        detail: wrapPromise(getDetail()),
    };
};

//계좌 수정 API
export const modifyAccountPrompt = (
    invitationCode, price, bank, bankAccount, name
) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .put(`/chatbot/invitation/account/${invitationCode}`, {
                account: {
                    price,
                    bank,
                    bankAccount,
                    name,
                }
            })
            .then((res) => {
                const { data } = res;
                const { invitation } = data;
                return invitation;
            });
        return asyncDetail;
    };
    return {
        detail: wrapPromise(getDetail()),
    };
};

//장소 수정 API
export const modifyPlacePrompt = (
    invitationCode, place
) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .put(`/chatbot/place/${invitationCode}`, {
                place
            })
            .then((res) => {
                const { data } = res;
                const { invitation } = data;
                return invitation;
            });
        return asyncDetail;
    };
    return {
        detail: wrapPromise(getDetail()),
    };
};