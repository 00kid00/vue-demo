// stores/goods.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGoodsStore = defineStore('goods', () => {
  // 状态
  const goodsData = ref({}) // 结构：{ [userId]: goodsList }

  // Getter：获取当前用户商品
  const currentUserGoods = (userId) => computed(() => goodsData.value[userId] || []).value

  // 操作：加载数据
  const loadGoodsData = () => {
    const savedData = localStorage.getItem('goodsData')
    if (savedData) {
      goodsData.value = JSON.parse(savedData)
    }
  }

  // 操作：保存数据
  const saveGoodsData = () => {
    localStorage.setItem('goodsData', JSON.stringify(goodsData.value))
  }

  // 操作：添加商品
  const addGoods = (userId, goods) => {
    if (!goodsData.value[userId]) {
      goodsData.value[userId] = []
    }
    goodsData.value[userId].unshift({
      ...goods,
      id: Date.now(),
      createTime: new Date().toLocaleString()
    })
    saveGoodsData()
  }

  // 操作：更新商品
  const updateGoods = (userId, goodsId, newData) => {
    const goods = goodsData.value[userId]
    if (goods) {
      const index = goods.findIndex(item => item.id === goodsId)
      if (index !== -1) {
        goodsData.value[userId][index] = {
          ...goodsData.value[userId][index],
          ...newData
        }
        saveGoodsData()
      }
    }
  }

  // 操作：删除商品
  const deleteGoods = (userId, goodsId) => {
    const goods = goodsData.value[userId]
    if (goods) {
      goodsData.value[userId] = goods.filter(item => item.id !== goodsId)
      saveGoodsData()
    }
  }

  return {
    goodsData,
    currentUserGoods,
    loadGoodsData,
    saveGoodsData,
    addGoods,
    updateGoods,
    deleteGoods
  }
})
