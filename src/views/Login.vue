<script setup>
import { ref, reactive } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { register } from '../api/auth'

const router = useRouter()

// 响应式表单数据
const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ]
})

// 登录加载状态
const loading = ref(false)

// 提交登录
const handleLogin = async () => {
  try {
    loading.value = true
    //const response = await axios.post('/api/login', loginForm)
    const response = await axios.post('/api/login', {
      username: registerForm.username,
      password: registerForm.password,
    })

    // 处理登录成功逻辑
    ElMessage.success('登录成功')
    localStorage.setItem('token', response.data.token)

    // 跳转到主页
    router.push('/')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2 class="login-title">系统登录</h2>

      <el-form :model="loginForm" :rules="rules" label-width="80px" label-position="top">
        <!-- 用户名输入 -->
        <el-form-item prop="username" label="用户名">
          <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="请输入用户名" clearable />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            show-password />
        </el-form-item>

        <!-- 记住我 + 注册链接 -->
        <el-form-item>
          <div class="form-extra">
            <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
            <div class="register-link">
              <router-link to="/register">没有账号？立即注册</router-link>
            </div>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button type="primary" :loading="loading" @click="handleLogin" class="login-btn">
          {{ loading ? '登录中...' : '立即登录' }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-box {
  width: 420px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.form-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: -5px 0 10px;
}

.register-link {
  font-size: 14px;

  a {
    color: #409eff;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #66b1ff;
      text-decoration: underline;
    }
  }
}

.login-btn {
  width: 100%;
  margin-top: 0px;
  height: 42px;
}
</style>
