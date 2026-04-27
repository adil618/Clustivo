import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URI || "https://clustivo-backend.vercel.app/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;