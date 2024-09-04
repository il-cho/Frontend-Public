import { wrapPromise } from "../promise/wrapPromise.js";

import api from "../auth/Api.js";

//초대장 조회 API
export const getInvitation = async (invitationCode) => {
    try {
        const res = await api.get(`/invitation/view/${invitationCode}`);
        const { data } = res;
        return data;
    } catch (error) {
        console.error("초대장 조회 실패", error);
        throw error;
    }
};

//초대장 목록 조회 API
export const getInvitationList = async () => {
    const getDetail = async () => {
        const asyncDetail = await api.get(`/invitation/list`).then((res) => {
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
export const modifyInvitation = (
    inviter,
    invitationCode,
    title,
    description,
    image,
    confirmDate
) => {
    const getDetail = async () => {
        const asyncDetail = await api
            .put(`/invitation`, {
                inviter,
                invitationCode,
                title,
                description,
                image,
                confirmDate,
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

//초대장 기능 수정 API
export const modifyInvitationFeature = async (
    invitationCode,
    feature,
    show) => {
    try {
        const res = await api.put(`/invitation/${invitationCode}/feature`, {
            "invitationCode": invitationCode,
            [feature]: show,
        });
        const { data } = res;
        return data;
    } catch (error) {
        console.error("초대장 기능 조회 실패", error);
        throw error;
    }
};


//초대장 삭제 API
export const deleteInvitation = async (invitationCode) => {
    const getDetail = async () => {
        const asyncDetail = await api.delete(`/invitation/${invitationCode}`).then((res) => {
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

//계좌 정보 생성 API
export const createAccount = async (invitationCode, price, bankName, bankAccount, accountHolder) => {
    try {
        const res = await api.post(`/invitation/account`, {
            invitationCode,
            price,
            bankName,
            bankAccount,
            accountHolder,
        })
        const { data } = res;
        const { account } = data;
        return account
    } catch (error) {
        console.error('계좌 정보 생성 실패', error);
        throw error;
    }
}

//계좌 정보 조회 API
export const getAccount = async (invitationCode) => {
    try {
        const res = await api.get(`/invitation/account/${invitationCode}`)
        const { data } = res;
        //console.log("계좌 조회 -> ", data);
        return data
    } catch (error) {
        //console.error('계좌 정보 조회 실패', error);
        throw error;
    }
}

// 계좌 정보 수정 API
export const modifyAccount = async (id, invitationCode, price, bankName, bankAccount, accountHolder) => {
    const res = await api.put(`/invitation/account`, {
        id,
        invitationCode,
        price,
        bankName,
        bankAccount,
        accountHolder,
    })

    if (res.status === 200) {
        //console.log('계좌 정보 수정 성공');
        return res.data;  // 성공 시 true 반환
    } else {
        //console.error('계좌 정보 수정 실패', res);
        return res;  // 실패 시 false 반환
    }
};

// 계좌 정보 삭제 API 
export const deleteAccount = (invitationCode, attend) => {
    const getDetail = async () => {
        const asyncDetail = await api.delete(`/invitation/account/${invitationCode}`, {
            attend
        });

        if (asyncDetail.status === 200) {
            //console.log("계좌 정보 삭제 성공");
            return true; // 성공 시 true 반환
        } else {
            //console.error("계좌 정보 삭제 실패", asyncDetail);
            return false; // 실패 시 false 반환
        }
    }
}

// 참석 여부 조회 API
export const getAttend = async (invitationCode) => {
    try {
        const res = await api.get(`/invitation/participant/${invitationCode}`)
        const { data } = res;

        //console.log("참석 여부 조회 -> ", data);
        return data;
    } catch (error) {
        if (error.response) {
            // 서버가 상태 코드와 함께 응답했지만, 2xx 범위에 있지 않은 경우
            if (error.response.status === 400) {
                console.error('참석 여부 조회 실패: 상태 코드', error.response.status);
                return error.response.status;
            } else {
                console.error('참석 여부 조회 실패: 상태 코드', error.response.status);
            }
            return error.response.status;
        } else if (error.request) {
            // 요청이 만들어졌지만 응답을 받지 못한 경우
            console.error('참석 여부 조회 API 요청 중 오류 발생: 응답 없음', error.request);
        } else {
            // 요청을 설정하는 중에 오류가 발생한 경우
            console.error('참석 여부 조회 API 요청 중 오류 발생', error.message);
        }
        return false;
    }
}

// 참석 표시 API
export const attendInvitation = async (invitationCode, isChecked) => {
    try {
        const asyncDetail = await api.post(`/invitation/participant/${invitationCode}`, {
            'attend': isChecked
        });
        //console.log("참석 여부 API 요청");

        if (asyncDetail.status == 200) {
            return true;
        } else {
            console.error('참석 여부 실패', asyncDetail);
            return false;
        }
    } catch (error) {
        console.error('참석 표시 API 요청 중 오류 발생', error);
        return false;
    }
}

// 참여자 명단 리스트 조회 API
export const getParticipantList = async (invitationCode) => {
    try {
        const res = await api.get(`/invitation/participant/list/${invitationCode}`);
        return res;
    } catch (error) {
        console.error('참여자 명단 리스트 조회 API 요청 중 오류 발생', error);
        return false;
    }
}