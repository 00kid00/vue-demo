import axios from 'axios'

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    console.log("config: ", config);
    return config;
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log("response: ", response);
    return response;
  },
  (err) => Promise.reject(err)
)

export default instance
