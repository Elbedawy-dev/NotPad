import axios from "axios"

const api = axios.create({
    baseURL: "https://notpadbackend.vercel.app/api",
    withCredentials: true
})

export default api
