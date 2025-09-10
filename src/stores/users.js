import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserList, getUserDetail, updateUserStatus } from '@/api/users'
import { ElMessage } from 'element-plus'

export const useUsersStore = defineStore('users', () => {
  // 状态
  const userList = ref([])
  const currentUser = ref(null)
  const loading = ref(false)
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })
  const searchKeyword = ref('')

  // 获取用户列表
  const fetchUserList = async (params = {}) => {
    try {
      loading.value = true
      const queryParams = {
        page: pagination.value.page,
        pageSize: pagination.value.pageSize,
        keyword: searchKeyword.value,
        ...params
      }
      
      const response = await getUserList(queryParams)
      if (response.success) {
        userList.value = response.data.list
        pagination.value = {
          page: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        }
      }
    } catch (error) {
      ElMessage.error(error.message || '获取用户列表失败')
    } finally {
      loading.value = false
    }
  }

  // 获取用户详情
  const fetchUserDetail = async (id) => {
    try {
      loading.value = true
      const response = await getUserDetail(id)
      if (response.success) {
        currentUser.value = response.data
        return response.data
      }
    } catch (error) {
      ElMessage.error(error.message || '获取用户详情失败')
    } finally {
      loading.value = false
    }
  }

  // 更新用户状态
  const changeUserStatus = async (id, status) => {
    try {
      const response = await updateUserStatus(id, status)
      if (response.success) {
        ElMessage.success(response.message)
        // 刷新列表
        await fetchUserList()
      }
    } catch (error) {
      ElMessage.error(error.message || '更新用户状态失败')
    }
  }

  // 搜索用户
  const searchUsers = async (keyword) => {
    searchKeyword.value = keyword
    pagination.value.page = 1
    await fetchUserList()
  }

  // 重置搜索
  const resetSearch = async () => {
    searchKeyword.value = ''
    pagination.value.page = 1
    await fetchUserList()
  }

  return {
    // 状态
    userList,
    currentUser,
    loading,
    pagination,
    searchKeyword,
    // 方法
    fetchUserList,
    fetchUserDetail,
    changeUserStatus,
    searchUsers,
    resetSearch
  }
})