import { Cookies } from "react-cookie";

const cookies = new Cookies();

//refreshToken 가져오기
export const getRefreshToken = async () => {
    const token = await cookies.getItem("refresh_token");
    return token ? `Bearer ${token}` : null;
}

//refresh Token 저장하기
export const setRefreshToken = (refreshToken) => {
    cookies.setItem("refresh_token", refreshToken);
}

//accessToken 가져오기
export const getAccessToken = async () => {
    const token = sessionStorage.getItem("AccessToken");
    return token ? `Bearer ${token}` : null;
}

//accessToken 저장하기
export const setAccessToken = (accessToken) => {
    sessionStorage.setItem("access_token", accessToken);
}