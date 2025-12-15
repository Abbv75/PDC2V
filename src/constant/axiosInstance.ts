import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: (process.env.NODE_ENV == 'production')
        ? process.env.REACT_APP_API_URL_PROD
        : process.env.REACT_APP_API_URL_DEV,
});