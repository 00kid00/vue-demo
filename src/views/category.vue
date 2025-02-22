<!-- src/views/Category.vue -->
<template>
  <div class="category-container">
    <!-- 分类标题 -->
    <div class="eco-banner">
      <h1>环保商品专区</h1>
      <p>让闲置流通，为地球减负</p>
    </div>

    <!-- 分类主体 -->
    <div class="category-main">
      <!-- 侧边分类导航 -->
      <div class="category-side">
        <el-menu :default-active="activeCategory" class="category-menu" @select="handleSelect">
          <el-menu-item index="all">
            <el-icon>
              <Menu />
            </el-icon>
            <span>全部商品</span>
          </el-menu-item>
          <el-menu-item v-for="category in categories" :key="category.id" :index="category.id">
            <el-icon>
              <component :is="category.icon" />
            </el-icon>
            <span>{{ category.name }}</span>
            <el-tag v-if="category.eco" type="success" effect="dark" size="small">
              环保
            </el-tag>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 商品展示 -->
      <div class="product-list">
        <!-- 环保筛选 -->
        <div class="eco-filter">
          <el-radio-group v-model="showEcoOnly">
            <el-radio-button :label="false">全部商品</el-radio-button>
            <el-radio-button :label="true">仅看环保商品</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 商品卡片 -->
        <el-row :gutter="20">
          <el-col v-for="product in filteredProducts" :key="product.id" :xs="24" :sm="12" :md="8" :lg="6">
            <el-card class="product-card" shadow="hover">
              <!-- 环保角标 -->
              <div v-if="product.isEco" class="eco-corner">
                <el-icon color="#fff">
                  <MagicStick />
                </el-icon>
                <span>环保认证</span>
              </div>

              <div class="product-image">
                <el-image :src="product.image" fit="cover" :lazy="true" />
              </div>

              <div class="product-info">
                <h3 class="product-title">{{ product.title }}</h3>
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span class="original-price">¥{{ product.originalPrice }}</span>
                </div>
                <div class="product-tags">
                  <el-tag v-for="tag in product.tags" :key="tag" type="info" size="small">
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Menu,
  // Leaf,
  MagicStick,
  Present,
  Box,
  Reading,
  Iphone,
  TrendCharts
} from '@element-plus/icons-vue'

// 分类数据
const categories = ref([
  { id: '1', name: '数码电子', icon: Iphone, eco: true },
  { id: '2', name: '服饰箱包', icon: Present, eco: true },
  { id: '3', name: '图书教材', icon: Reading, eco: true },
  { id: '4', name: '家居用品', icon: Box, eco: false },
  { id: '5', name: '其他类别', icon: TrendCharts, eco: false }
])

// 商品数据
const products = ref([
  {
    id: 1,
    title: '99新 iPhone 12',
    price: 2999,
    originalPrice: 6799,
    image: 'https://example.com/phone.jpg',
    category: '1',
    isEco: true,
    tags: ['99新', '官方认证', '一年保修']
  },
  {
    id: 2,
    title: '纯棉环保帆布包',
    price: 39,
    originalPrice: 89,
    image: 'https://example.com/bag.jpg',
    category: '2',
    isEco: true,
    tags: ['手作', '可降解']
  },
  // 更多商品数据...
])

const activeCategory = ref('all')
const showEcoOnly = ref(false)

// 处理分类选择
const handleSelect = (index) => {
  activeCategory.value = index
}

// 过滤商品
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // 分类过滤
    const categoryMatch = activeCategory.value === 'all' ||
      product.category === activeCategory.value

    // 环保过滤
    const ecoMatch = !showEcoOnly.value || product.isEco

    return categoryMatch && ecoMatch
  })
})
</script>

<style scoped>
.category-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.eco-banner {
  background: #e8f5e9;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  margin-bottom: 30px;
}

.eco-banner h1 {
  color: #2e7d32;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.eco-banner p {
  color: #43a047;
  font-size: 1.2rem;
}

.category-main {
  display: flex;
  gap: 20px;
}

.category-side {
  width: 220px;
}

.category-menu {
  border-right: none;
}

.product-list {
  flex: 1;
}

.eco-filter {
  margin-bottom: 20px;
  text-align: right;
}

.product-card {
  position: relative;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.eco-corner {
  position: absolute;
  top: 0;
  right: 0;
  background: #4caf50;
  color: white;
  padding: 6px 12px;
  border-radius: 0 4px 0 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  z-index: 1;
}

.product-image {
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 15px 0;
}

.product-title {
  font-size: 1.1rem;
  margin: 0 0 10px;
  color: #333;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.current-price {
  color: #f56c6c;
  font-size: 1.3rem;
  font-weight: bold;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.product-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .category-main {
    flex-direction: column;
  }

  .category-side {
    width: 100%;
  }

  .product-image {
    height: 150px;
  }
}
</style>
