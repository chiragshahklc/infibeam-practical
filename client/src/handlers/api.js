import axios from "./axios"

const uploadData = async ({ servers }) => {
    try {
        await axios.post("/servers", {
            servers,
        })
        return true
    } catch (error) {
        throw new Error("Failed")
    }
}

const fetchData = async ({ filters = "" }) => {
    try {
        let result = await axios.get("/servers" + filters)
        return result.data
    } catch (error) {
        throw new Error("Failed")
    }
}

const fetchLocationFilters = async () => {
    try {
        let result = await axios.get("/filters/location")
        return result.data
    } catch (error) {
        throw new Error("Failed")
    }
}

export default { uploadData, fetchData, fetchLocationFilters }
