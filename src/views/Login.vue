<script setup>
import { ref, reactive } from 'vue'
import { useStore } from "vuex";
import { User, Lock } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from "@/api/login"

const router = useRouter()

// 响应式表单数据
const loginForm = reactive({
  username: 'Chenst',
  password: '123456',
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

const loading = ref(false)
const loginFormRef = ref(null)

// 提交登录
async function handleLogin() {
  //try {
  //  const res = await login(loginForm);
  //  console.log(res);
  //} catch (error) {
  //  console.log(res);
  //}

  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u =>
      u.username === loginForm.username &&
      u.password === loginForm.password
    )
    if (!user) throw new Error('用户名或密码错误')
    // 存储登录状态
    localStorage.setItem('currentUser', JSON.stringify(user))
    ElMessage.success('登录成功')
    router.push('/index') // 确保路径正确
  } catch (error) {
    ElMessage.error(error.message)
    console.error('登录失败:', error)
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-box">
      <h2 class="login-title">登录</h2>

      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="80px" label-position="top">
        <!-- 用户名输入 -->
        <el-form-item ref="loginFormRef" prop="username" label="用户名">
          <el-input type="text" v-model="loginForm.username" :prefix-icon="User" placeholder="请输入用户名" clearable />
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            show-password />
        </el-form-item>

        <!-- 注册链接 -->
        <el-form-item>
          <div class="register-link">
            <router-link to="/register">没有账号？立即注册</router-link>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button type="primary" @click="handleLogin" class="login-btn" :loading="loading">
          {{ loading ? '登录中...' : '立即登录' }}
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-container {
  overflow: hidden;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
