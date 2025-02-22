import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  // 初始化时从本地存储恢复登录状态
  const initAuth = () => {
    try {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
    } catch (error) {
      console.error('解析用户数据失败:', error)
      // 可以选择清除无效的数据
      localStorage.removeItem('currentUser')
    }
  }

  // 登录方法
  const login = (userData) => {
    user.value = userData
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  // 退出方法
  const logout = () => {
    user.value = null
    localStorage.removeItem('currentUser')

        // 清除相关衍生数据
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return { user, initAuth, login, logout }
})
