import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
// 初始化认证状态
const authStore = useAuthStore()
authStore.initAuth()
app.use(ElementPlus)
app.use(router)
app.mount('#app')
