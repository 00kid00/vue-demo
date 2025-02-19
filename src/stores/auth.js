import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  
  // 初始化时从本地存储恢复登录状态
  const initAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  // 登录方法
  const login = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // 退出方法
  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return { user, initAuth, login, logout }
})
