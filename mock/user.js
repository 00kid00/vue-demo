// mock/user.js
import { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/login',  // 接口路径
    method: 'post',     // 请求方法
    response: () => ({  // 模拟返回数据
      code: 200,
      data: { token: 'mock-token' }
    })
  }
]
