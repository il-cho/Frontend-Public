import axios from "axios";
import { getAccessToken } from "./Token";

const api = axios.create({
    baseURL: `https://sample/api`,
    headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
    }
})

api.interceptors.request.use(async (config) => {
    const accessToken = await getAccessToken();
    config.headers['Authorization'] = accessToken;
    return config;
}, (error) => {
    return Promise.reject(error);
})

export default api;