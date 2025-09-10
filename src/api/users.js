import usersData from '@/mockData/users.json'

// 模拟网络延迟
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise<Object>} 用户列表数据
 */
export const getUserList = async (params = {}) => {
  await delay()

  const { page = 1, pageSize = 10, keyword = '' } = params
  let filteredUsers = usersData

  // 关键词搜索
  if (keyword) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.username.includes(keyword) ||
        user.email.includes(keyword) ||
        user.name.includes(keyword),
    )
  }

  // 分页处理
  const total = filteredUsers.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredUsers.slice(start, end)

  return {
    success: true,
    data: {
      list,
      total,
      page,
      pageSize,
    },
  }
}

/**
 * 获取用户详情
 * @param {string} id - 用户ID
 * @returns {Promise<Object>} 用户详情
 */
export const getUserDetail = async (id) => {
  await delay()

  const user = usersData.find((u) => u.id === id)
  if (user) {
    return {
      success: true,
      data: user,
    }
  } else {
    throw new Error('用户不存在')
  }
}

/**
 * 更新用户状态
 * @param {string} id - 用户ID
 * @param {string} status - 新状态
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserStatus = async (id, status) => {
  await delay()

  return {
    success: true,
    message: `用户状态已更新为${status}`,
  }
}
