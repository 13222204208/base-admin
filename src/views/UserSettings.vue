<template>
  <div class="settings">
    <el-row :gutter="20">
      <!-- 个人资料设置 -->
      <el-col :span="12">
        <el-card class="profile-card">
          <template #header>
            <div class="card-header">
              <el-icon><User /></el-icon>
              <span>个人资料</span>
            </div>
          </template>

          <div class="profile-section">
            <div class="avatar-section">
              <el-avatar :size="80" :src="profileForm.avatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <el-button type="primary" size="small" @click="handleAvatarUpload">
                更换头像
              </el-button>
            </div>

            <el-form
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-width="80px"
              class="profile-form"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="profileForm.username" disabled />
              </el-form-item>

              <el-form-item label="姓名" prop="name">
                <el-input v-model="profileForm.name" />
              </el-form-item>

              <el-form-item label="邮箱" prop="email">
                <el-input v-model="profileForm.email" />
              </el-form-item>

              <el-form-item label="电话" prop="phone">
                <el-input v-model="profileForm.phone" />
              </el-form-item>

              <el-form-item label="部门" prop="department">
                <el-input v-model="profileForm.department" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="handleUpdateProfile" :loading="profileLoading">
                  保存资料
                </el-button>
                <el-button @click="handleResetProfile">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>

      <!-- 密码修改 -->
      <el-col :span="12">
        <el-card class="password-card">
          <template #header>
            <div class="card-header">
              <el-icon><Lock /></el-icon>
              <span>修改密码</span>
            </div>
          </template>

          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="100px"
            class="password-form"
          >
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input
                v-model="passwordForm.currentPassword"
                type="password"
                show-password
                placeholder="请输入当前密码"
              />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>

            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入新密码"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleUpdatePassword" :loading="passwordLoading">
                修改密码
              </el-button>
              <el-button @click="handleResetPassword">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import { User, UserFilled, Lock } from '@element-plus/icons-vue'

const authStore = useAuthStore()
const profileFormRef = ref()
const passwordFormRef = ref()
const profileLoading = ref(false)
const passwordLoading = ref(false)

// 个人资料表单
const profileForm = reactive({
  username: '',
  name: '',
  email: '',
  phone: '',
  department: '',
  avatar: '',
})

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// 表单验证规则
const profileRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
}

const passwordRules = {
  currentPassword: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 初始化个人资料
const initProfile = () => {
  const user = authStore.user
  if (user) {
    Object.assign(profileForm, {
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      department: user.department || '',
      avatar: user.avatar,
    })
  }
}

// 头像上传
const handleAvatarUpload = () => {
  ElMessage.info('头像上传功能开发中...')
}

// 更新个人资料
const handleUpdateProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    profileLoading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('个人资料更新成功')
  } catch (error) {
    ElMessage.error(error.message || '个人资料更新失败')
  } finally {
    profileLoading.value = false
  }
}

// 重置个人资料
const handleResetProfile = () => {
  initProfile()
  profileFormRef.value?.clearValidate()
}

// 修改密码
const handleUpdatePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true

    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))

    ElMessage.success('密码修改成功')
    handleResetPassword()
  } catch (error) {
    ElMessage.error(error.message || '密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

// 重置密码表单
const handleResetPassword = () => {
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  passwordFormRef.value?.clearValidate()
}

// 组件挂载时初始化
onMounted(() => {
  initProfile()
})
</script>

<style scoped>
.settings {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
}

.profile-form {
  margin-top: 20px;
}

.password-form {
  padding-top: 20px;
}

.config-section {
  margin-bottom: 20px;
}

.config-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.config-item:last-child {
  border-bottom: none;
}

.config-item span {
  color: #606266;
  font-size: 14px;
}

.config-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
}

@media (max-width: 768px) {
  .settings {
    padding: 10px;
  }

  .el-row {
    margin: 0;
  }

  .el-col {
    margin-bottom: 20px;
  }
}
</style>
