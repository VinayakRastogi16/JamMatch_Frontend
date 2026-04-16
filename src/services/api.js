import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api/v1/users",
});

API.interceptors.request.use((req)=>{
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    
    if(token){
        req.headers.Authorization = token;
    }
    return req;
});


export default API;
