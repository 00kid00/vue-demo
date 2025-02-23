import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
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
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: { 
      requiresAuth: false, // 不需要登陆
      title: '主页'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { 
      requiresAuth: false, // 不需要登陆
      title: '用户注册'
    },
    children:[
      {
        path: '/index',
        name: 'index',
        component: () => import('@/layouts/MainLayout.vue'),
      },
    ],
  },
  //{
  //  path: '/Emission',
  //  name: 'Emission',
  //  component: () => import('../views/Emission.vue'),
  //  meta: { 
  //    requiresAuth: false, // 不需要登陆
  //    title: '碳足迹'
  //  },
  //},
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/user.vue'),
    meta: { 
      requiresAuth: true, // 不需要登陆
      title: '个人中心'
    },
  },
  //{
  //  path: '/category',
  //  name: 'category',
  //  component: () => import('../views/category.vue'),
  //  meta: { 
  //    requiresAuth: false, // 不需要登陆
  //    title: '分类'
  //  },
  //},
  //{
  //path: '/category',
  //component: () => import('@/views/category.vue')
  //},
  {
    path: '/index',
    name: 'index',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,  // 需要登录
      title: '春夏秋冬'
    },
    children:[
     // {        
     //   path: '/index',
     //   name: 'Index',
     //   component: () => import('@/views/index.vue')
     // },
      {
        path: '/category',
        name: 'category',
        component: () => import('@/views/category.vue')
      },
      {
        path: '/emission',
        name: 'Emission',
        component: () => import('@/views/Emission.vue')
      },
      {
        path: '/about',
        name: 'about'
      },
    ],
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
  //const isAuthenticated = localStorage.getItem('token')
  const isAuthenticated = !!localStorage.getItem('currentUser') // 改为检查currentUser
  
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
    next({ path: '/index' })  // 重定向到首页
  }
  // 5. 其他情况直接放行
  else {
    next()
  }
})

export default router
