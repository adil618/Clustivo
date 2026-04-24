import axios from "axios"

const api = axios.create({
  baseURL: `${process.env.API_BASE_URL}/api/v1`,
  withCredentials: true,
})

export default api
