<script setup>
import { reactive, ref } from 'vue'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()

// 响应式表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '长度在3到16个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'blur'
    }
  ],
})

const validatePassword = (rule, value, callback) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 加载状态
const loading = ref(false)

// 提交注册
//const handleRegister = async () => {
//  try {
//    loading.value = true
//    const response = await axios.post('/api/register', {
//      username: registerForm.username,
//      password: registerForm.password,
//    })
//
//    ElMessage.success('注册成功')
//    router.push('/login')
//  } catch (error) {
//    // 增强错误处理
//    let errorMessage = '注册失败'
//    if (error.response) {
//      errorMessage = error.response.data?.message ||
//        `服务器错误：${error.response.status}`
//    } else if (error.request) {
//      errorMessage = '无法连接到服务器'
//    }
//    ElMessage.error(errorMessage)
//  } finally {
//    loading.value = false
//  }
//}
const handleRegister = () => {
  try {
    // 本地验证
    if (registerForm.password !== registerForm.confirmPassword) {
      throw new Error('密码不一致')
    }

    // 获取已注册用户
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')

    // 检查重复用户
    if (existingUsers.some(u => u.username === registerForm.username)) {
      throw new Error('用户名已存在')
    }

    // 存储用户（⚠️ 密码明文存储仅用于演示）
    const newUser = {
      username: registerForm.username,
      password: registerForm.password,
      email: registerForm.email,
      registerDate: new Date().toISOString()
    }

    localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]))

    ElMessage.success('注册成功')
    router.push('/login')

  } catch (error) {
    ElMessage.error('注册失败: ' + error.message)
  }
}
</script>

<template>
  <div class="register-container">
    <el-card class="register-box">
      <h2 class="register-title">用户注册</h2>

      <el-form :model="registerForm" :rules="rules" label-width="100px" label-position="top">
        <!-- 用户名输入 -->
        <el-form-item prop="username" label="用户名">
          <el-input v-model="registerForm.username" :prefix-icon="User" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input v-model="registerForm.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
            show-password />
        </el-form-item>

        <el-form-item prop="confirmPassword" label="确认密码">
          <el-input v-model="registerForm.confirmPassword" :prefix-icon="Lock" type="password" placeholder="请再次输入密码"
            show-password />
        </el-form-item>

        <el-button type="primary" :loading="loading" @click="handleRegister" class="register-btn">
          {{ loading ? '注册中...' : '立即注册' }}
        </el-button>

        <div class="login-link">
          已有账号？<router-link to="/login">去登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.register-box {
  width: 480px;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.register-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.register-btn {
  width: 100%;
  margin-top: 20px;
  height: 42px;
}

.login-link {
  margin-top: 15px;
  text-align: center;
  color: #666;

  a {
    color: #409eff;
    text-decoration: none;

    &:hover {
      color: #66b1ff;
    }
  }
}
</style>
