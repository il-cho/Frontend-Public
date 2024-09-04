import { wrapPromise } from "../promise/wrapPromise.js";

import api from "../auth/Api.js";

// 초대장 위치 등록
export const createMap = (userId, invitationCode, placeInfo) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .post(`/places`, {
                userId,
                invitationCode,
                placeInfo,
            })
            .then(
                ({ data }) => {
                    return data;
                }
            )
        return asyncDetail;
    }
    return {
        detail: wrapPromise(getDetail())
    }
}

// 초대장 위치 삭제
export const deleteMap = (placeId) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .delete(`/places/${placeId}`)
            .then(({ data }) => {
                return data;
            })
        return asyncDetail
    }
    return {
        detail: wrapPromise(getDetail())
    }
}

// 초대장 위치 조회
export const getMap = async (invitationCode) => {
    try {
        const res = await api.get(`/places?invitationCode=${invitationCode}`);
        const { data } = res;
        return data;
    } catch (error) {
        console.error("일정 조회 실패", error);
        throw error;
    }
}

export const createMapWithRefresh = (userId, invitationCode, placeInfo) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .post(`/places?refresh=true`, {
                userId,
                invitationCode,
                placeInfo,
            })
            .then(
                ({ data }) => {
                    return data;
                }
            )
        return asyncDetail;
    }
    return {
        detail: wrapPromise(getDetail())
    }
}