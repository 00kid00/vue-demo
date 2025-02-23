<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const loginForm = reactive({
  username: 'Chenst',
  password: '123456',
})

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在3到12个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' }
  ]
})

const loading = ref(false)
const loginFormRef = ref(null)

async function handleLogin() {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u =>
      u.username === loginForm.username &&
      u.password === loginForm.password
    )

    if (!user) throw new Error('用户名或密码错误')

    localStorage.setItem('currentUser', JSON.stringify(user))
    ElMessage.success('登录成功')
    auth.login(user)
    router.push('/index')
  } catch (error) {
    ElMessage.error(error.message)
    console.error('登录失败:', error)
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 动态背景层 -->
    <div class="dynamic-bg">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
    </div>

    <el-card class="login-box">
      <h2 class="login-title">欢迎回来</h2>
      <div class="sub-title">开启您的数字之旅</div>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-position="top">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="用户名" clearable class="custom-input" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="loginForm.password" :prefix-icon="Lock" type="password" placeholder="密码" show-password
            class="custom-input" />
        </el-form-item>

        <el-button type="primary" @click="handleLogin" class="login-btn" :loading="loading">
          {{ loading ? '登录中...' : '立即登录' }}
        </el-button>

        <div class="social-login">
          <el-divider>其他登录方式</el-divider>
          <div class="social-icons">
            <el-icon :size="28"><i class="iconfont icon-wechat" /></el-icon>
            <el-icon :size="28"><i class="iconfont icon-github" /></el-icon>
          </div>
        </div>

        <div class="footer-links">
          <router-link to="/register">注册账号</router-link>
          <span>|</span>
          <router-link to="/forgot">忘记密码</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 动态波浪背景 */
.dynamic-bg {
  position: absolute;
  width: 200%;
  height: 100%;
  animation: waveMove 20s linear infinite;
}

.wave {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: rgba(255, 255, 255, 0.1);
}

.wave1 {
  animation: wave 8s linear infinite;
  opacity: 0.5;
}

.wave2 {
  animation: wave 12s linear infinite;
  opacity: 0.3;
  animation-delay: -5s;
}

.wave3 {
  animation: wave 15s linear infinite;
  opacity: 0.2;
  animation-delay: -2s;
}

.login-box {
  width: 420px;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.97);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.login-box:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

.login-title {
  text-align: center;
  margin-bottom: 10px;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.sub-title {
  text-align: center;
  color: #909399;
  margin-bottom: 40px;
  font-size: 14px;
  position: relative;
}

.custom-input {
  border-color: #409eff;

}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  letter-spacing: 2px;
  background: linear-gradient(45deg, #409eff, #66b1ff);
  border: none;
  transition: all 0.3s;
  border-radius: 8px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
  }
}


.social-login {
  margin-top: 30px;

  .el-divider__text {
    background: transparent;
    color: #909399;
    font-size: 12px;
    padding: 0 15px;
  }
}

.social-icons .el-icon:hover {
  color: #409eff;
  transform: translateY(-3px);
}

.footer-links {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;

  a {
    color: #606266;
    text-decoration: none;
    position: relative;
    padding: 0 5px;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: #409eff;
      transition: width 0.3s;
    }

    &:hover::after {
      width: 100%;
    }
  }

  span {
    margin: 0 12px;
    color: #dcdfe6;
  }
}

@keyframes wave {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1)
  }

  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.8)
  }

  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1)
  }
}

@keyframes btnShine {
  0% {
    transform: translateX(-100%) rotate(45deg)
  }

  100% {
    transform: translateX(100%) rotate(45deg)
  }
}
</style>
