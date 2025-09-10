<template>
  <div class="login-container">
    <!-- 动态背景粒子 -->
    <div class="particles">
      <div class="particle" v-for="i in 50" :key="i"></div>
    </div>
    
    <div class="login-card">
      <div class="login-header">
        <div class="logo-animation">
          <div class="logo-circle"></div>
        </div>
        <h2>后台管理系统</h2>
        <p>欢迎登录</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username" class="form-item-animated">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password" class="form-item-animated">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="authStore.loading"
            @click="handleLogin"
          >
            {{ authStore.loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-tips">
        <p>测试账号：</p>
        <p>管理员：admin / admin123</p>
        <p>普通用户：user / user123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

defineOptions({
  name: 'AdminLogin',
})

const router = useRouter()
const authStore = useAuthStore()
const loginFormRef = ref()
// 登录表单数据
const loginForm = reactive({
  username: '',
  password: '',
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    const valid = await loginFormRef.value.validate()
    if (valid) {
      // 确保传递的是普通对象，而不是响应式对象
      const credentials = {
        username: loginForm.username,
        password: loginForm.password,
      }
      await authStore.login(credentials)
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('登录失败:', error)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 动态背景粒子效果 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.particle:nth-child(odd) {
  animation-delay: -2s;
  animation-duration: 8s;
}

.particle:nth-child(even) {
  animation-delay: -4s;
  animation-duration: 10s;
}

/* 随机分布粒子 */
.particle:nth-child(1) { left: 10%; top: 20%; }
.particle:nth-child(2) { left: 20%; top: 80%; }
.particle:nth-child(3) { left: 60%; top: 40%; }
.particle:nth-child(4) { left: 80%; top: 10%; }
.particle:nth-child(5) { left: 90%; top: 60%; }
.particle:nth-child(6) { left: 30%; top: 90%; }
.particle:nth-child(7) { left: 70%; top: 70%; }
.particle:nth-child(8) { left: 40%; top: 30%; }
.particle:nth-child(9) { left: 15%; top: 50%; }
.particle:nth-child(10) { left: 85%; top: 85%; }

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
  animation: cardSlideIn 0.8s ease-out;
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
  animation: headerFadeIn 1s ease-out 0.3s both;
}

@keyframes headerFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo动画效果 */
.logo-animation {
  margin-bottom: 20px;
}

.logo-circle {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  position: relative;
  animation: logoRotate 3s linear infinite;
}

.logo-circle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.logo-circle::after {
  content: '🔐';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 20px;
}

@keyframes logoRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login-header h2 {
  color: #303133;
  margin-bottom: 8px;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

/* 表单项动画 */
.form-item-animated {
  animation: formItemSlide 0.6s ease-out;
  animation-fill-mode: both;
}

.form-item-animated:nth-child(1) {
  animation-delay: 0.4s;
}

.form-item-animated:nth-child(2) {
  animation-delay: 0.6s;
}

@keyframes formItemSlide {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 22px;
  transition: all 0.3s ease;
  animation: buttonFadeIn 0.6s ease-out 0.8s both;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

@keyframes buttonFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-tips {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 16px;
  border-radius: 12px;
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  animation: tipsFadeIn 0.6s ease-out 1s both;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

@keyframes tipsFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-tips p {
  margin: 0;
  margin-bottom: 4px;
}

.login-tips p:last-child {
  margin-bottom: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-card {
    margin: 10px;
    padding: 30px 20px;
  }
  
  .particles {
    display: none; /* 在小屏幕上隐藏粒子效果以提升性能 */
  }
}
</style>
