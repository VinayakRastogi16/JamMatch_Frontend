import axios from "axios";
import { redirectTo } from "./navigation";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1/users",
});

API.interceptors.request.use((req) => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const token = user?.token;

      if (token) {
        req.headers.Authorization = token;
      }
    } catch (e) {
        console.log("Invalid user data in localStorage:", e);
    }
  }

  return req;
});

API.interceptors.response.use(
    (response)=>response,

    (e)=>{
        if(e.response?.status===403&&e.response?.data?.code === "EMAIL_NOT_VERIFIED"){
            redirectTo("/verify-email/pending");
        }

        return Promise.reject(e);
    }
)

export default API;
