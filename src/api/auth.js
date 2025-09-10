import authData from '@/mockData/auth.json'

// 模拟网络延迟
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 用户登录
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (credentials) => {
  await delay()
  
  const { username, password } = credentials
  const validUser = authData.validCredentials.find(
    user => user.username === username && user.password === password
  )
  
  if (validUser) {
    return {
      success: true,
      token: validUser.token,
      user: validUser.user,
      message: '登录成功'
    }
  } else {
    throw new Error('用户名或密码错误')
  }
}

/**
 * 用户登出
 * @returns {Promise<Object>} 登出结果
 */
export const logout = async () => {
  await delay(200)
  return {
    success: true,
    message: '登出成功'
  }
}

/**
 * 获取用户信息
 * @param {string} token - 用户token
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = async (token) => {
  await delay()
  
  const validUser = authData.validCredentials.find(
    user => user.token === token
  )
  
  if (validUser) {
    return {
      success: true,
      user: validUser.user
    }
  } else {
    throw new Error('无效的token')
  }
}