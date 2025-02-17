import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { 
      requiresAuth: false, // 不需要登陆
      title: '用户登陆'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { 
      requiresAuth: false, // 不需要登陆
      title: '用户注册'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: {
      requiresAuth: true,  // 需要登录
      title: '控制面板'
    }
  },
  // 其他路由...
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫配置
router.beforeEach((to, from, next) => {
  // 1. 设置页面标题
  document.title = to.meta.title || '默认标题'

  // 2. 获取登录状态（根据实际项目调整）
  const isAuthenticated = localStorage.getItem('token')
  
  // 3. 访问需要认证的页面
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // 记录原始访问路径（登录后跳转回去）
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }
  // 4. 已登录访问登录/注册页
  else if (['Login', 'Register'].includes(to.name) && isAuthenticated) {
    next({ path: '/dashboard' })  // 重定向到首页
  }
  // 5. 其他情况直接放行
  else {
    next()
  }
})

export default router
