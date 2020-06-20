import axios from "axios"

let instance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
})

export default instance
