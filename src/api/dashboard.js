import dashboardData from '@/mockData/dashboard.json'

// 模拟网络延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取仪表板统计数据
 * @returns {Promise<Object>} 统计数据
 */
export const getDashboardStats = async () => {
  await delay()
  
  return {
    success: true,
    data: dashboardData.stats
  }
}

/**
 * 获取图表数据
 * @param {string} type - 图表类型 (userGrowth, salesData, revenueData)
 * @returns {Promise<Object>} 图表数据
 */
export const getChartData = async (type) => {
  await delay()
  
  const chartData = dashboardData.chartData[type]
  if (chartData) {
    return {
      success: true,
      data: chartData
    }
  } else {
    throw new Error('图表类型不存在')
  }
}

/**
 * 获取最近活动记录
 * @param {number} limit - 限制数量
 * @returns {Promise<Object>} 活动记录
 */
export const getRecentActivities = async (limit = 10) => {
  await delay()
  
  const activities = dashboardData.recentActivities.slice(0, limit)
  return {
    success: true,
    data: activities
  }
}

/**
 * 获取所有仪表板数据
 * @returns {Promise<Object>} 完整仪表板数据
 */
export const getDashboardData = async () => {
  await delay()
  
  return {
    success: true,
    data: {
      stats: dashboardData.stats,
      chartData: dashboardData.chartData,
      recentActivities: dashboardData.recentActivities
    }
  }
}