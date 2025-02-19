<template>
  <div class="home-container">

    <!-- 轮播图区域 -->
    <el-carousel :interval="4000" type="card" height="400px">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <img :src="item.imgUrl" class="banner-image" />
      </el-carousel-item>
    </el-carousel>

    <!-- 商品展示区域 -->
    <div class="product-section">
      <h2 class="section-title">热销商品</h2>
      <el-row :gutter="20">
        <el-col v-for="product in products" :key="product.id" :xs="12" :sm="8" :md="6" :lg="4" :xl="4">
          <el-card class="product-card" shadow="hover">
            <img :src="product.image" class="product-image" />
            <div class="product-info">
              <h3 class="product-title">{{ product.title }}</h3>
              <p class="product-price">¥{{ product.price }}</p>
              <el-button type="primary" @click="addToCart(product)">加入购物车</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShoppingCart } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 轮播图数据
const banners = ref([
  {
    imgUrl: 'https://cdn.example.com/banner1.jpg',
    link: '#'
  },
  {
    imgUrl: 'https://cdn.example.com/banner2.jpg',
    link: '#'
  },
  {
    imgUrl: 'https://cdn.example.com/banner3.jpg',
    link: '#'
  }
])

// 商品数据
const products = ref([
  {
    id: 1,
    title: '智能手机 X1',
    price: 2999,
    image: 'https://cdn.example.com/product1.jpg'
  },
  {
    id: 2,
    title: '无线蓝牙耳机',
    price: 399,
    image: 'https://cdn.example.com/product2.jpg'
  },
  {
    id: 3,
    title: '智能手表',
    price: 899,
    image: 'https://cdn.example.com/product3.jpg'
  },
  // 可以继续添加更多商品...
])

// 当前激活的菜单项
const activeIndex = ref('1')

// 处理菜单选择
const handleSelect = (key) => {
  console.log('菜单选择:', key)
}

// 添加商品到购物车
const addToCart = (product) => {
  console.log('添加到购物车:', product)
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}



.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.product-card {
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  text-align: center;
}

.product-title {
  font-size: 16px;
  margin: 10px 0;
  height: 40px;
  overflow: hidden;
}

.product-price {
  color: #f56c6c;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}
</style>
