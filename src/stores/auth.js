import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, logout as logoutApi, getUserInfo } from '@/api/auth'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || '')
  const userName = computed(() => user.value?.name || '')
  const userAvatar = computed(() => user.value?.avatar || '')

  // 登录方法
  const login = async (credentials) => {
    try {
      loading.value = true
      const response = await loginApi(credentials)
      
      if (response.success) {
        token.value = response.token
        user.value = response.user
        
        // 持久化存储
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        ElMessage.success(response.message)
        return response
      }
    } catch (error) {
      ElMessage.error(error.message || '登录失败')
      throw error
    } finally {
      loading.value = false
    }
  }

  // 登出方法
  const logout = async () => {
    try {
      await logoutApi()
      
      // 清除状态
      token.value = ''
      user.value = null
      
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      ElMessage.success('登出成功')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    if (!token.value) return
    
    try {
      const response = await getUserInfo(token.value)
      if (response.success) {
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      logout()
    }
  }

  return {
    // 状态
    token,
    user,
    loading,
    // 计算属性
    isAuthenticated,
    userRole,
    userName,
    userAvatar,
    // 方法
    login,
    logout,
    fetchUserInfo
  }
}, {
  persist: {
    key: 'auth-store',
    storage: localStorage,
    paths: ['token', 'user']
  }
})