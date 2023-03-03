import axios from "axios"
import { Message } from 'element-ui'

const instance = axios.create({
    // baseURL: "http://127.0.0.1:6550",
    baseURL: "http://110.40.169.124:6550",
    timeout: 10000
})

// 请求拦截器   
// instance.interceptors.request.use(config => {
//     let token = localStorage.getItem("token");

//     if(token){
//         config.headers = config.headers || {};
//         config.headers["token"] = token;
//     }
//     return config
// }, err => {
//     return Promise.reject(err)
// })

// 响应拦截器
instance.interceptors.response.use(res => {
    // 统一管理错误提示
    let data = res.data  
    if(data.code!==0){
        Message({
            message: data.msg || "网络请求错误",
            type: 'error'
        });
        
    }
    return data  
}, err => {
    return Promise.reject(err)
})
export default instance 