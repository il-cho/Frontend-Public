import { wrapPromise } from "../promise/wrapPromise.js";

import api from "../auth/Api.js";

// 초대장 일정 생성
export const createSchedule = (invitationCode, startDate, endDate, confirmed) => {
    const getDetail = async () => {
        const asyncDetail = await api.post(`/schedule`, {
            invitationCode,
            startDate,
            endDate,
            confirmed,
        })
            .then(res => {
                const { data } = res;
                return data;
            })
        return asyncDetail;
    }
    return {
        detail: wrapPromise(getDetail())
    }
}

// 초대장 일정 수정
export const modifySchedule = async (invitationCode, startDate, endDate, possibleDate, confirmed) => {
    const getDetail = async () => {
        const asyncDetail = await api.put(`/schedule`, {
            invitationCode,
            startDate,
            endDate,
            possibleDate,
            confirmed,
        })
            .then(res => {
                const { data } = res;
                return data;
            })
        return asyncDetail;
    }

    const result = await getDetail ();

    return {
        result,
    }
}

// 초대장 일정 조회
// export const getSchedule = async (invitationCode) => {
//     const getDetail = async () => {
//         const asyncDetail = await api.get(`/schedule/${invitationCode}`)
//             .then(res => {
//                 console.log(res);
//                 const { data } = res;
//                 console.log(data);
//                 return data
//             })
//         return asyncDetail;
//     }

//     const result = await getDetail();
//     return {
//         result,
//     }
// }

export const getSchedule = async (invitationCode) => {
    try {
        const res = await api.get(`/schedule/${invitationCode}`);
        const { data } = res;
        //console.log(data)
        return data;
    } catch (error) {
        console.error("일정 조회 실패", error);
        throw error;
    }
};

// 초대장 일정 삭제
export const deleteSchedule = (invitationCode) => {
    const getDetail = async () => {
        const asyncDetail = await api.get(`/schedule/${invitationCode}`)
        if (asyncDetail.status === 200) {
            return true;  // 성공 시 true 반환
        } else {
            console.error('일정 정보 삭제 실패', asyncDetail);
            return false;  // 실패 시 false 반환
        }
    }
}