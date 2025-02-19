<template>
  <el-header class="header">
    <div class="logo">
      <router-link to="/">
        <img src="@/assets/logo.png" alt="商城Logo" style="height: 40px">
      </router-link>
    </div>

    <el-menu :default-active="activeIndex" class="nav-menu" mode="horizontal" :router="true">
      <el-menu-item index="/index">首页</el-menu-item>
      <el-menu-item index="/category">商品分类</el-menu-item>
      <el-menu-item index="/about">关于我们</el-menu-item>
    </el-menu>

    <div class="user-info">
      <template v-if="!auth.user">
        <el-button type="text" @click="showLogin">登录</el-button>
        <!--<el-button type="text">注册</el-button> -->
      </template>
      <template v-else>
        <el-dropdown>
          <span class="user-name">
            欢迎，{{ auth.user.name }}<el-icon><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <router-link to="/cart">
        <el-icon :size="20" class="cart-icon">
          <ShoppingCart />
          <span class="cart-count">0</span>
        </el-icon>
      </router-link>
    </div>
  </el-header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart } from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const router = useRouter()

const loginVisible = ref(false)

// 根据当前路由自动激活菜单项
const activeIndex = computed(() => router.path)

const showLogin = () => {
  router.push('/login')
  loginVisible.value = true
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.logo {
  width: 120px;
}

.nav-menu {
  flex: 1;
  margin: 0 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  color: #606266;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f56c6c;
  color: white;
  border-radius: 10px;
  padding: 0 5px;
  font-size: 12px;
}
</style>
