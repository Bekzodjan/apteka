import axios from "axios";

export default function apiCall(url, method, data) {
    return axios({
        baseURL: 'http://localhost:3001',
        url,
        method,
        data
    })
}