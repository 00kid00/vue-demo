<!-- src/components/Emission.vue -->
<template>
  <!--<NavHeader />-->
  <div class="emission-calculator">
    <!-- 标题 -->
    <!--<el-page-header title="碳足迹计算器" class="header" />-->

    <!-- 输入区域 -->
    <div class="input-sections">
      <!-- 能源消耗 -->
      <el-card class="input-card">
        <template #header>
          <div class="card-header">
            <el-icon>
              <Opportunity />
            </el-icon>
            <h3>能源消耗</h3>
          </div>
        </template>

        <div class="input-group" v-for="field in energyFields" :key="field.key">
          <el-input v-model.number="emissionData.energy[field.key]" @change="handleInputChange"
            :placeholder="`请输入${field.label}`" clearable>
            <template #prepend>{{ field.label }}</template>
            <template #append>{{ field.unit }}</template>
          </el-input>
          <div class="input-tip" v-if="field.tip">
            <el-icon>
              <InfoFilled />
            </el-icon>
            <span>{{ field.tip }}</span>
          </div>
        </div>
      </el-card>

      <!-- 交通出行 -->
      <el-card class="input-card">
        <template #header>
          <div class="card-header">
            <el-icon>
              <MapLocation />
            </el-icon>
            <h3>交通出行</h3>
          </div>
        </template>

        <div class="input-group" v-for="field in transportFields" :key="field.key">
          <el-input v-model.number="emissionData.transportation[field.key]" @change="handleInputChange"
            :placeholder="`请输入${field.label}`" clearable>
            <template #prepend>{{ field.label }}</template>
            <template #append>{{ field.unit }}</template>
          </el-input>
          <div class="input-tip" v-if="field.tip">
            <el-icon>
              <InfoFilled />
            </el-icon>
            <span>{{ field.tip }}</span>
          </div>
        </div>
      </el-card>

      <!-- 饮食消费 -->
      <el-card class="input-card">
        <template #header>
          <div class="card-header">
            <el-icon>
              <KnifeFork />
            </el-icon>
            <h3>饮食消费</h3>
          </div>
        </template>

        <div class="input-group" v-for="field in dietFields" :key="field.key">
          <el-input v-model.number="emissionData.diet[field.key]" @change="handleInputChange"
            :placeholder="`请输入${field.label}`" clearable>
            <template #prepend>{{ field.label }}</template>
            <template #append>{{ field.unit }}</template>
          </el-input>
          <div class="input-tip" v-if="field.tip">
            <el-icon>
              <InfoFilled />
            </el-icon>
            <span>{{ field.tip }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <el-button type="primary" @click="saveData">
        <el-icon>
          <Upload />
        </el-icon> 保存数据
      </el-button>
      <el-button @click="loadData">
        <el-icon>
          <Download />
        </el-icon> 加载数据
      </el-button>
      <el-button type="danger" @click="resetData">
        <el-icon>
          <Delete />
        </el-icon> 重置数据
      </el-button>
    </div>

    <!-- 结果展示 -->
    <el-card class="result-card">
      <template #header>
        <div class="result-header">
          <el-icon>
            <DataAnalysis />
          </el-icon>
          <span>碳排放分析</span>
        </div>
      </template>

      <!-- 图表容器 -->
      <div ref="chartRef" class="chart-container"></div>

      <!-- 总计展示 -->
      <div class="total-section">
        <el-statistic title="总碳排放量" :value="totalEmission" :precision="2">
          <template #suffix>kgCO₂e</template>
        </el-statistic>
      </div>
    </el-card>
  </div>

  <!-- 公共页脚 -->
  <el-footer class="footer">
    <p>© 2025 春夏秋冬 版权所有</p>
  </el-footer>
</template>

<script setup>
import NavHeader from '@/components/NavHeader.vue'
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { Pie } from '@antv/g2plot'
import { ElMessage } from 'element-plus'
import {
  Opportunity,
  MapLocation,
  KnifeFork,
  Upload,
  Download,
  Delete,
  DataAnalysis,
  InfoFilled
} from '@element-plus/icons-vue'

// ==============================
// 排放因子配置
// ==============================
const EMISSION_FACTORS = {
  // 能源类 (kgCO₂e/单位)
  electricity: 0.82,   // 电力 (kWh)
  natural_gas: 2.02,   // 天然气 (m³)
  gasoline: 2.31,      // 汽油 (升)
  diesel: 2.68,        // 柴油 (升)

  // 交通类 (kgCO₂e/km)
  car: 0.192,          // 小汽车
  bus: 0.089,          // 公交车
  train: 0.041,        // 火车
  plane_short: 0.185,  // 短途航班
  plane_long: 0.124,   // 长途航班

  // 饮食类 (kgCO₂e/kg)
  beef: 27.0,          // 牛肉
  chicken: 6.9,        // 鸡肉
  pork: 12.1,          // 猪肉
  rice: 2.7,           // 大米
  vegetables: 0.4      // 蔬菜
}

// ==============================
// 响应式数据
// ==============================
const emissionData = reactive({
  energy: {
    electricity: 0,
    natural_gas: 0,
    gasoline: 0,
    diesel: 0
  },
  transportation: {
    car: 0,
    bus: 0,
    train: 0,
    plane_short: 0,
    plane_long: 0
  },
  diet: {
    beef: 0,
    chicken: 0,
    pork: 0,
    rice: 0,
    vegetables: 0
  }
})

// ==============================
// 输入字段配置
// ==============================
const energyFields = [
  { key: 'electricity', label: '电力消耗', unit: 'kWh', tip: '家庭/企业每月用电量' },
  { key: 'natural_gas', label: '天然气用量', unit: 'm³', tip: '供暖/烹饪用气量' },
  { key: 'gasoline', label: '汽油用量', unit: '升', tip: '汽车加油量' },
  { key: 'diesel', label: '柴油用量', unit: '升', tip: '工业/运输用油量' }
]

const transportFields = [
  { key: 'car', label: '自驾里程', unit: 'km', tip: '小汽车行驶里程' },
  { key: 'bus', label: '公交里程', unit: 'km', tip: '公交车乘坐里程' },
  { key: 'train', label: '火车里程', unit: 'km', tip: '火车出行里程' },
  { key: 'plane_short', label: '短途航班', unit: 'km', tip: '<1000km的航班' },
  { key: 'plane_long', label: '长途航班', unit: 'km', tip: '>1000km的航班' }
]

const dietFields = [
  { key: 'beef', label: '牛肉消费', unit: 'kg', tip: '每月牛肉食用量' },
  { key: 'chicken', label: '鸡肉消费', unit: 'kg', tip: '每月鸡肉食用量' },
  { key: 'pork', label: '猪肉消费', unit: 'kg', tip: '每月猪肉食用量' },
  { key: 'rice', label: '大米消费', unit: 'kg', tip: '每月大米消耗量' },
  { key: 'vegetables', label: '蔬菜消费', unit: 'kg', tip: '每月蔬菜消耗量' }
]

// ==============================
// 计算属性
// ==============================
const totalEmission = computed(() => {
  return Object.entries(emissionData).reduce((total, [category, items]) => {
    return total + Object.entries(items).reduce((sum, [key, value]) => {
      return sum + (value * EMISSION_FACTORS[key])
    }, 0)
  }, 0)
})

const chartData = computed(() => {
  return Object.entries(emissionData).flatMap(([category, items]) =>
    Object.entries(items)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => ({
        type: `${category}.${key}`,
        value: value * EMISSION_FACTORS[key]
      }))
  )
})

// ==============================
// 图表相关
// ==============================
const chartRef = ref(null)
let pieChart = null

const initChart = () => {
  if (!chartRef.value) return

  pieChart = new Pie(chartRef.value, {
    data: chartData.value,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      content: '{name}\n{percentage}'
    },
    interactions: [{ type: 'element-active' }]
  })

  pieChart.render()
}

// 监听数据变化更新图表
watch(chartData, (newVal) => {
  if (pieChart) {
    pieChart.update({ data: newVal })
  }
})

// ==============================
// 数据持久化
// ==============================
const saveData = () => {
  try {
    localStorage.setItem('emissionData', JSON.stringify(emissionData))
    ElMessage.success('数据保存成功')
  } catch (err) {
    ElMessage.error('保存失败：' + err.message)
  }
}

const loadData = () => {
  try {
    const saved = localStorage.getItem('emissionData')
    if (saved) {
      Object.assign(emissionData, JSON.parse(saved))
      ElMessage.success('数据加载成功')
    }
  } catch (err) {
    ElMessage.error('加载失败：' + err.message)
  }
}

const resetData = () => {
  emissionData.energy = { electricity: 0, natural_gas: 0, gasoline: 0, diesel: 0 }
  emissionData.transportation = { car: 0, bus: 0, train: 0, plane_short: 0, plane_long: 0 }
  emissionData.diet = { beef: 0, chicken: 0, pork: 0, rice: 0, vegetables: 0 }
  ElMessage.success('数据已重置')
}

// ==============================
// 生命周期钩子
// ==============================
onMounted(() => {
  nextTick(() => {
    initChart()
    loadData()
  })
})

// 输入变化处理
const handleInputChange = () => {
  // 触发图表更新
  if (pieChart) {
    pieChart.update({ data: chartData.value })
  }
}
</script>

<style scoped lang="scss">
.emission-calculator {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  /*.header {
    margin-bottom: 30px;
  }*/

  .input-sections {
    display: grid;
    gap: 20px;
  }

  .input-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;

      .el-icon {
        font-size: 24px;
        color: #67C23A;
      }
    }

    .input-group {
      margin-bottom: 15px;

      .input-tip {
        font-size: 0.85em;
        color: #909399;
        margin-top: 5px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }

  .action-buttons {
    margin: 20px 0;
    display: flex;
    justify-content: center;
    gap: 15px;
  }

  .result-card {
    margin-top: 30px;

    .result-header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.1em;

      .el-icon {
        color: #409EFF;
      }
    }

    .chart-container {
      height: 400px;
    }

    .total-section {
      margin-top: 20px;
      padding: 20px;
      background-color: #f5f7fa;
      border-radius: 4px;
      text-align: center;

      :deep(.el-statistic__content) {
        font-size: 2.2em;
        color: #67C23A;
      }
    }
  }
}

@media (max-width: 768px) {
  .emission-calculator {
    padding: 10px;

    .action-buttons {
      flex-wrap: wrap;
    }

    .input-card {
      .el-input-group__prepend {
        width: 80px;
      }
    }
  }
}

.footer {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 20px;
}
</style>
