<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card" v-for="stat in statsCards" :key="stat.key">
        <div class="stat-content">
          <div class="stat-info">
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-change" :class="stat.changeClass">
              <el-icon><ArrowUp v-if="stat.trend === 'up'" /><ArrowDown v-else /></el-icon>
              {{ stat.change }}
            </div>
          </div>
          <div class="stat-icon" :style="{ backgroundColor: stat.color }">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>用户增长趋势</span>
            <el-button type="text" @click="refreshChartData">刷新</el-button>
          </div>
        </template>
        <div class="chart-container" ref="userGrowthChart"></div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>销售数据</span>
            <el-button type="text" @click="refreshChartData">刷新</el-button>
          </div>
        </template>
        <div class="chart-container" ref="salesChart"></div>
      </el-card>
    </div>

    <!-- 最近活动 -->
    <el-card class="activity-card">
      <template #header>
        <div class="card-header">
          <span>最近活动</span>
          <el-button type="text" @click="refreshActivities">刷新</el-button>
        </div>
      </template>
      
      <div class="activity-list" v-loading="dashboardStore.loading">
        <div 
          class="activity-item" 
          v-for="activity in dashboardStore.recentActivities" 
          :key="activity.id"
        >
          <div class="activity-icon" :class="getActivityIconClass(activity.type)">
            <el-icon><component :is="getActivityIcon(activity.type)" /></el-icon>
          </div>
          <div class="activity-content">
            <div class="activity-message">{{ activity.message }}</div>
            <div class="activity-time">{{ formatTime(activity.time) }}</div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import {
  User,
  ShoppingCart,
  Money,
  TrendCharts,
  ArrowUp,
  ArrowDown,
  UserFilled,
  DocumentAdd,
  SuccessFilled
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const dashboardStore = useDashboardStore()
const userGrowthChart = ref()
const salesChart = ref()

let userGrowthChartInstance = null
let salesChartInstance = null

// 统计卡片数据
const statsCards = computed(() => [
  {
    key: 'users',
    title: '总用户数',
    value: dashboardStore.stats.userCount?.toLocaleString() || '0',
    change: '+12.5%',
    trend: 'up',
    changeClass: 'positive',
    icon: User,
    color: '#409EFF'
  },
  {
    key: 'orders',
    title: '订单总数',
    value: dashboardStore.stats.orderCount?.toLocaleString() || '0',
    change: '+8.2%',
    trend: 'up',
    changeClass: 'positive',
    icon: ShoppingCart,
    color: '#67C23A'
  },
  {
    key: 'revenue',
    title: '总收入',
    value: `¥${dashboardStore.stats.revenue?.toLocaleString() || '0'}`,
    change: '+15.3%',
    trend: 'up',
    changeClass: 'positive',
    icon: Money,
    color: '#E6A23C'
  },
  {
    key: 'growth',
    title: '增长率',
    value: `${dashboardStore.stats.growthRate || 0}%`,
    change: '+2.1%',
    trend: 'up',
    changeClass: 'positive',
    icon: TrendCharts,
    color: '#F56C6C'
  }
])

// 初始化图表
const initCharts = async () => {
  await nextTick()
  
  // 用户增长图表
  if (userGrowthChart.value) {
    userGrowthChartInstance = echarts.init(userGrowthChart.value)
    const userGrowthOption = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: dashboardStore.chartData.userGrowth?.map(item => item.date) || []
      },
      yAxis: { type: 'value' },
      series: [{
        data: dashboardStore.chartData.userGrowth?.map(item => item.value) || [],
        type: 'line',
        smooth: true,
        itemStyle: { color: '#409EFF' }
      }]
    }
    userGrowthChartInstance.setOption(userGrowthOption)
  }
  
  // 销售数据图表
  if (salesChart.value) {
    salesChartInstance = echarts.init(salesChart.value)
    const salesOption = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: dashboardStore.chartData.salesData?.map(item => item.month) || []
      },
      yAxis: { type: 'value' },
      series: [{
        data: dashboardStore.chartData.salesData?.map(item => item.sales) || [],
        type: 'bar',
        itemStyle: { color: '#67C23A' }
      }]
    }
    salesChartInstance.setOption(salesOption)
  }
}

// 获取活动图标
const getActivityIcon = (type) => {
  const iconMap = {
    user_register: UserFilled,
    order_created: DocumentAdd,
    payment_success: SuccessFilled
  }
  return iconMap[type] || UserFilled
}

// 获取活动图标样式
const getActivityIconClass = (type) => {
  const classMap = {
    user_register: 'user-activity',
    order_created: 'order-activity',
    payment_success: 'payment-activity'
  }
  return classMap[type] || 'default-activity'
}

// 格式化时间
const formatTime = (time) => {
  return new Date(time).toLocaleString('zh-CN')
}

// 刷新图表数据
const refreshChartData = async () => {
  await dashboardStore.fetchAllData()
  initCharts()
}

// 刷新活动数据
const refreshActivities = () => {
  dashboardStore.fetchRecentActivities()
}

// 组件挂载时初始化
onMounted(async () => {
  await dashboardStore.fetchAllData()
  initCharts()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: #67C23A;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.chart-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.chart-container {
  height: 300px;
}

.activity-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: white;
}

.user-activity {
  background-color: #409EFF;
}

.order-activity {
  background-color: #67C23A;
}

.payment-activity {
  background-color: #E6A23C;
}

.default-activity {
  background-color: #909399;
}

.activity-content {
  flex: 1;
}

.activity-message {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}
</style>