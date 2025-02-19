<template>
  <div class="main-layout">
    <!-- 公共导航栏 -->
    <NavHeader />

    <!-- 页面内容区域 -->
    <main class="content">
      <router-view />
    </main>

    <!-- 公共页脚 -->
    <el-footer class="footer">
      <p>© 2025 春夏秋冬 版权所有</p>
      <p>联系我们 | 关于我们 | 服务条款</p>
    </el-footer>
  </div>
</template>

<script setup>
import NavHeader from '@/components/NavHeader.vue'
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
}
</style>
