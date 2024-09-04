import { wrapPromise } from "../promise/wrapPromise.js";

import api from "../auth/Api.js";

export const getUser = async () => {
    const getDetail = async () => {
        const asyncDetail = await api.get(`/user`)
            .then(res => {
                const { data } = res;
                return data;
            })
        return asyncDetail;
    }
    const result = await getDetail();
    return {
        result,
    }
}

export const logout = async () => {
    const getResponse = async () => {
        const responseData = await api.get(`/oauth2/authorization/logout`)
            .then(res => {
                if(res.status == 200) {
                    return true;
                }
                return false;
            })
    }
    const result = await getResponse();
    return {
        result,
    }
}

export const reissue = async () => {
    const getResponse = async () => {
        const response = await api.post(`/auth/reissue`)
            .then(res => {
                if(res.status == 200) {
                    const {data} = res;
                    return data;
                } else {
                    throw new Error('자동 로그인 실패');
                }
                
            })
            .catch(error => {
                
            })
            return response;
    }
    const token = await getResponse();
    return {
        token,
    }
}