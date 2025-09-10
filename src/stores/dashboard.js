import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDashboardStats, getChartData, getRecentActivities, getDashboardData } from '@/api/dashboard'
import { ElMessage } from 'element-plus'

export const useDashboardStore = defineStore('dashboard', () => {
  // 状态
  const stats = ref({})
  const chartData = ref({})
  const recentActivities = ref([])
  const loading = ref(false)

  // 获取统计数据
  const fetchStats = async () => {
    try {
      loading.value = true
      const response = await getDashboardStats()
      if (response.success) {
        stats.value = response.data
      }
    } catch (error) {
      ElMessage.error(error.message || '获取统计数据失败')
    } finally {
      loading.value = false
    }
  }

  // 获取图表数据
  const fetchChartData = async (type) => {
    try {
      const response = await getChartData(type)
      if (response.success) {
        chartData.value[type] = response.data
      }
    } catch (error) {
      ElMessage.error(error.message || '获取图表数据失败')
    }
  }

  // 获取最近活动
  const fetchRecentActivities = async (limit = 10) => {
    try {
      const response = await getRecentActivities(limit)
      if (response.success) {
        recentActivities.value = response.data
      }
    } catch (error) {
      ElMessage.error(error.message || '获取活动记录失败')
    }
  }

  // 获取所有仪表板数据
  const fetchAllData = async () => {
    try {
      loading.value = true
      const response = await getDashboardData()
      if (response.success) {
        stats.value = response.data.stats
        chartData.value = response.data.chartData
        recentActivities.value = response.data.recentActivities
      }
    } catch (error) {
      ElMessage.error(error.message || '获取仪表板数据失败')
    } finally {
      loading.value = false
    }
  }

  // 刷新数据
  const refreshData = async () => {
    await fetchAllData()
  }

  return {
    // 状态
    stats,
    chartData,
    recentActivities,
    loading,
    // 方法
    fetchStats,
    fetchChartData,
    fetchRecentActivities,
    fetchAllData,
    refreshData
  }
})