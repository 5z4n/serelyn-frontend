import axios from "axios";

const API = axios.create({
    baseURL: "https://serelyn-backend.onrender.com",
});

export default API;