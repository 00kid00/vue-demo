import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 在.env文件中配置
  timeout: 5000
})

// 注册接口
export const register = (data) => {
  return service.post('/register', data)
}

// 登录接口 
export const login = (data) => {
  return service.post('/login', data)
}

// 获取用户信息
export const getUserInfo = () => {
  return service.get('/user')
}
