<template>
  <nav-header />
  <div class="user-center-container">
    <!-- 头部信息 -->
    <el-card class="user-header">
      <div class="user-info">
        <el-avatar :size="80" :src="userInfo.avatar" class="user-avatar" />
        <div class="user-basic">
          <h2>{{ userInfo.nickname }}</h2>
          <p class="user-id">用户ID: {{ userInfo.userId }}</p>
          <p class="user-join">加入时间: {{ userInfo.joinTime }}</p>
        </div>
      </div>
    </el-card>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 侧边栏菜单 -->
      <el-menu class="side-menu" :default-active="activeMenu" @select="handleMenuSelect">
        <el-menu-item index="profile">
          <el-icon>
            <User />
          </el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="goods">
          <el-icon>
            <Goods />
          </el-icon>
          <span>我的发布</span>
        </el-menu-item>
        <el-menu-item index="orders">
          <el-icon>
            <Document />
          </el-icon>
          <span>我的订单</span>
        </el-menu-item>
        <el-menu-item index="security">
          <el-icon>
            <Lock />
          </el-icon>
          <span>账户安全</span>
        </el-menu-item>
      </el-menu>

      <!-- 内容区域 -->
      <div class="content-wrapper">
        <!-- 个人信息 -->
        <div v-if="activeMenu === 'profile'" class="profile-section">
          <el-form :model="userInfo" label-width="100px">
            <el-form-item label="昵称">
              <el-input v-model="userInfo.nickname" />
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="userInfo.username" disabled />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input v-model="userInfo.bio" type="textarea" :autosize="{ minRows: 3 }" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 我的发布 -->
        <div v-if="activeMenu === 'goods'" class="goods-section">
          <div class="goods-filter">
            <el-select v-model="goodsStatus" placeholder="商品状态">
              <el-option label="全部" value="" />
              <el-option label="出售中" value="onsale" />
              <el-option label="已售出" value="sold" />
            </el-select>
            <el-button type="primary" @click="createGoods" class="add-btn">
              发布新商品
            </el-button>
          </div>

          <el-table :data="filteredGoods" style="width: 100%">
            <el-table-column prop="title" label="商品名称" />
            <el-table-column prop="price" label="价格" width="120">
              <template #default="{ row }">¥{{ row.price }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)">
                  {{ goodsStatusMap[row.status] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="{ row }">
                <el-button size="small" @click="openEdit(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteGoods(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 商品表单对话框 -->
        <el-dialog v-model="showGoodsDialog" :title="isEditing ? '编辑商品' : '发布新商品'" width="600px">
          <el-form :model="goodsForm" :rules="goodsRules" ref="goodsFormRef" label-width="80px">
            <el-form-item label="商品标题" prop="title">
              <el-input v-model="goodsForm.title" placeholder="请输入商品名称" />
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="goodsForm.price" type="number" placeholder="请输入价格">
                <template #append>¥</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
              <el-input v-model="goodsForm.description" type="textarea" :rows="4" placeholder="请输入详细描述" />
            </el-form-item>
            <el-form-item label="商品状态" prop="status">
              <el-select v-model="goodsForm.status" placeholder="请选择状态">
                <el-option label="出售中" value="onsale" />
                <el-option label="已下架" value="off" />
              </el-select>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showGoodsDialog = false">取消</el-button>
              <el-button type="primary" @click="submitGoodsForm">确定</el-button>
            </span>
          </template>
        </el-dialog>

        <!-- 账户安全 -->
        <div v-if="activeMenu === 'security'" class="security-section">
          <el-form label-width="120px">
            <el-form-item label="修改密码">
              <el-input v-model="passwordForm.newPassword" type="password" placeholder="新密码" show-password />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="确认新密码" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePassword">
                修改密码
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import NavHeader from '@/components/NavHeader.vue'
import {
  User,
  Goods,
  Document,
  Lock
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const router = useRouter()

// 商品表单相关状态
const showGoodsDialog = ref(false)
const isEditing = ref(false)
const currentGoodsId = ref(null)
const goodsFormRef = ref(null)


// 商品表单数据
const goodsForm = reactive({
  title: '',
  price: null,
  description: '',
  status: 'onsale'
})

// 表单验证规则
const goodsRules = {
  title: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在3到50个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    //{ type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
    { min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ]
}

// 用户信息
const userInfo = ref({
  userId: '',
  nickname: '二手达人',
  username: '',
  avatar: 'https://example.com/avatar.jpg',
  bio: '热爱二手交易的环保主义者',
  joinTime: ''
})

// 组件挂载时加载用户数据
onMounted(() => {
  loadUserData()
})
// 商品数据
const goodsList = ref([
  { id: 1, title: '九成新智能手机', price: 1999, status: 'onsale' },
  { id: 2, title: '经典款单反相机', price: 3500, status: 'sold' }
])

const goodsStatus = ref('')
const goodsStatusMap = {
  onsale: '出售中',
  sold: '已售出'
}

// 密码表单
const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
})

// 菜单控制
const activeMenu = ref('profile')

const loadUserData = () => {
  const storedUser = localStorage.getItem('currentUser');
  const parsedUser = JSON.parse(storedUser)
  userInfo.value = {
    userId: parsedUser.id || '未知ID',
    username: parsedUser.username || '未知Name',
    joinTime: parsedUser.registerDate || '位置Date'
  }

}
// 计算属性
const filteredGoods = computed(() => {
  return goodsStatus.value
    ? goodsList.value.filter(item => item.status === goodsStatus.value)
    : goodsList.value
})

const statusTagType = (status) => {
  return status === 'onsale' ? 'success' : 'info'
}

// 方法
const handleMenuSelect = (key) => {
  activeMenu.value = key
}

const saveProfile = () => {
  ElMessage.success('个人信息保存成功')
}

const createGoods = () => {
  // 跳转到商品发布页面
  isEditing.value = false
  resetGoodsForm()
  showGoodsDialog.value = true
}

// 打开编辑商品对话框
const openEdit = (row) => {
  isEditing.value = true
  currentGoodsId.value = row.id
  Object.assign(goodsForm, {
    title: row.title,
    price: row.price,
    description: row.description || '',
    status: row.status
  })
  showGoodsDialog.value = true
}

// 重置表单
const resetGoodsForm = () => {
  goodsFormRef.value?.resetFields()
  currentGoodsId.value = null
  Object.assign(goodsForm, {
    title: '',
    price: null,
    description: '',
    status: 'onsale'
  })
}


// 提交表单
const submitGoodsForm = async () => {
  try {
    await goodsFormRef.value.validate()

    if (isEditing.value) {
      // 更新商品
      const index = goodsList.value.findIndex(item => item.id === currentGoodsId.value)
      if (index !== -1) {
        goodsList.value[index] = {
          ...goodsList.value[index],
          ...goodsForm,
          id: currentGoodsId.value
        }
      }
    } else {
      // 新增商品
      goodsList.value.unshift({
        id: Date.now(), // 生成唯一ID
        ...goodsForm,
        createTime: new Date().toLocaleString()
      })
    }

    showGoodsDialog.value = false
    ElMessage.success(isEditing.value ? '商品修改成功' : '商品发布成功')
  } catch (e) {
    console.error('表单验证失败', e)
  }
}


const deleteGoods = (row) => {
  ElMessageBox.confirm('确认删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    goodsList.value = goodsList.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

const changePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  // 调用修改密码接口
  ElMessage.success('密码修改成功')
}
</script>

<style scoped lang="scss">
.user-center-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;

  .user-header {
    margin-bottom: 20px;

    .user-info {
      display: flex;
      align-items: center;
      padding: 20px;

      .user-avatar {
        margin-right: 30px;
      }

      .user-basic {
        h2 {
          margin: 0 0 8px 0;
          font-size: 24px;
        }

        .user-id,
        .user-join {
          margin: 4px 0;
          color: #666;
        }
      }
    }
  }

  .main-content {
    display: flex;
    gap: 20px;

    .side-menu {
      width: 220px;
      min-height: 400px;
    }

    .content-wrapper {
      flex: 1;

      .goods-filter {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;

        .add-btn {
          margin-left: 10px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;

    .side-menu {
      width: 100% !important;
    }
  }
}

/* 添加对话框样式 */
.el-dialog {
  border-radius: 8px;
}

.el-form-item {
  margin-bottom: 22px;
}
</style>
