import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // 例如，添加 token 提到请求头中
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.error("请求拦截器错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // do something with response data 可以对数据进行一些统一处理
    return response.data;
  },
  (error) => {
    // do something with response error 可以统一处理错误
    // 例如，检查错误状态码
    if (error.response) {
      const { status, statusText } = error.response;
      console.error(`HTTP 错误 ${status}: ${statusText}`);
    } else {
      console.error("网络错误:", error.message);
    }
    return Promise.reject(error);
  }
);

export default instance;
