<template>
  <div class="eco-container">
    <!-- 新增导航栏 -->
    <nav-header class="transparent-header" />
    <!-- 背景图片层 -->
    <div class="background-image" :style="{ opacity: bgOpacity }"></div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 中间主题内容 -->
      <div class="hero-section">
        <h1 class="title">守护地球家园</h1>
        <p class="subtitle">从每一个小小的环保行动开始</p>
        <el-button type="success" size="large" @click="scrollToContent">
          了解详情
        </el-button>
      </div>

      <!-- 下方介绍内容 -->
      <div class="content-section" ref="contentSection">
        <el-row :gutter="30" class="content-cards">
          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="eco-card">
              <template #header>
                <div class="card-header">
                  <el-icon size="24">
                    <Opportunity />
                  </el-icon>
                  <span>节能减排</span>
                </div>
              </template>
              <p>推广清洁能源使用，减少碳排放，实现碳中和目标</p>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="eco-card">
              <template #header>
                <div class="card-header">
                  <el-icon size="24">
                    <MagicStick />
                  </el-icon>
                  <span>循环利用</span>
                </div>
              </template>
              <p>建立完善的垃圾分类和资源回收体系，促进可持续发展</p>
            </el-card>
          </el-col>

          <el-col :xs="24" :sm="12" :md="8">
            <el-card class="eco-card">
              <template #header>
                <div class="card-header">
                  <el-icon size="24">
                    <Warning />
                  </el-icon>
                  <span>生态保护</span>
                </div>
              </template>
              <p>保护生物多样性，维护自然生态系统的平衡</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>

  <!-- 公共页脚 -->
  <el-footer class="footer">
    <p>© 2025 春夏秋冬 版权所有</p>
  </el-footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Opportunity, MagicStick, Warning } from '@element-plus/icons-vue'
import NavHeader from '@/components/NavHeader.vue'

const bgOpacity = ref(1)
const contentSection = ref(null)

// 处理滚动事件
const handleScroll = () => {
  const scrollY = window.scrollY || window.pageYOffset
  const contentTop = contentSection.value?.offsetTop || 0
  const fadeStart = contentTop * 0.5

  // 计算透明度
  bgOpacity.value = 1 - Math.min(scrollY / fadeStart, 1)
}

// 滚动到内容区域
const scrollToContent = () => {
  contentSection.value?.scrollIntoView({
    behavior: 'smooth'
  })
}

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  /* 高于背景层 */
  backdrop-filter: blur(5px);
}

.eco-container {
  padding-top: 60px;
  /* 与导航栏高度匹配 */
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    url('https://images.unsplash.com/photo-1469474968028-56623f02e42e') center/cover;
  z-index: 0;
  transition: opacity 0.3s ease;
}

.main-content {
  position: relative;
  z-index: 1;
}

.hero-section {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.title {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  animation: fadeInUp 1s 0.2s ease backwards;
}

.content-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 80px 20px;
  min-height: 100vh;
  backdrop-filter: blur(5px);
}

.content-cards {
  max-width: 1200px;
  margin: 0 auto;
}

.eco-card {
  margin-bottom: 30px;
  transition: transform 0.3s ease;
}

.eco-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  color: var(--el-color-success);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
}
</style>
