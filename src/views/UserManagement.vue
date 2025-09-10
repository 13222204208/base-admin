<template>
  <div class="user-management">
    <el-card>
      <!-- 搜索和操作栏 -->
      <div class="toolbar">
        <div class="search-section">
          <el-input
            v-model="usersStore.searchKeyword"
            placeholder="搜索用户名或邮箱"
            style="width: 300px"
            clearable
            @input="handleSeach"
          >
            <template #prefix
              >r
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleResetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>

        <div class="action-section">
          <el-button type="primary" @click="handleAddUser">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
          <el-button @click="handleRefresh">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>

      <!-- 用户表格 -->
      <el-table
        :data="usersStore.userList"
        v-loading="usersStore.loading"
        stripe
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :alt="row.name">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="用户名" min-width="120" />

        <el-table-column prop="name" label="姓名" min-width="100" />

        <el-table-column prop="email" label="邮箱" min-width="180" />

        <el-table-column prop="phone" label="电话" min-width="120" />

        <el-table-column prop="department" label="部门" min-width="100" />

        <el-table-column label="角色" min-width="100">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)">{{ getRoleText(row.role) }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createdAt" label="创建时间" min-width="160">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewUser(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button type="warning" size="small" @click="handleEditUser(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteUser(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="usersStore.pagination.currentPage"
          v-model:page-size="usersStore.pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="usersStore.pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <div v-if="currentUser" class="user-detail">
        <div class="user-avatar">
          <el-avatar :size="80" :src="currentUser.avatar">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
        </div>

        <div class="user-info">
          <div class="info-item">
            <label>用户名：</label>
            <span>{{ currentUser.username }}</span>
          </div>
          <div class="info-item">
            <label>姓名：</label>
            <span>{{ currentUser.name }}</span>
          </div>
          <div class="info-item">
            <label>邮箱：</label>
            <span>{{ currentUser.email }}</span>
          </div>
          <div class="info-item">
            <label>电话：</label>
            <span>{{ currentUser.phone }}</span>
          </div>
          <div class="info-item">
            <label>部门：</label>
            <span>{{ currentUser.department }}</span>
          </div>
          <div class="info-item">
            <label>角色：</label>
            <el-tag :type="getRoleTagType(currentUser.role)">{{
              getRoleText(currentUser.role)
            }}</el-tag>
          </div>
          <div class="info-item">
            <label>状态：</label>
            <el-tag :type="currentUser.status === 'active' ? 'success' : 'danger'">
              {{ currentUser.status === 'active' ? '激活' : '禁用' }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>创建时间：</label>
            <span>{{ formatDate(currentUser.createdAt) }}</span>
          </div>
          <div class="info-item">
            <label>更新时间：</label>
            <span>{{ formatDate(currentUser.updatedAt) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, UserFilled, View, Edit, Delete } from '@element-plus/icons-vue'

const usersStore = useUsersStore()
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentUser = ref(null)

// 搜索处理
const handleSearch = () => {
  usersStore.searchUsers()
}

// 重置搜索
const handleResetSearch = () => {
  usersStore.resetSearch()
  usersStore.fetchUserList()
}

// 刷新数据
const handleRefresh = () => {
  usersStore.fetchUserList()
}

// 添加用户
const handleAddUser = () => {
  ElMessage.info('添加用户功能开发中...')
}

// 查看用户详情
const handleViewUser = async (user) => {
  try {
    currentUser.value = await usersStore.fetchUserDetail(user.id)
    dialogTitle.value = '用户详情'
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取用户详情失败：' + error.message)
  }
}

// 编辑用户
const handleEditUser = (user) => {
  console.log(user)
  ElMessage.info('编辑用户功能开发中...')
}

// 删除用户
const handleDeleteUser = (user) => {
  ElMessageBox.confirm(`确定要删除用户 "${user.name}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      ElMessage.info('删除用户功能开发中...')
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

// 状态变更
const handleStatusChange = async (user) => {
  try {
    await usersStore.changeUserStatus(user.id, user.status)
    ElMessage.success('用户状态更新成功')
  } catch (error) {
    ElMessage.error('用户状态更新失败：' + error.message)
    // 恢复原状态
    user.status = user.status === 'active' ? 'inactive' : 'active'
  }
}

// 分页大小变更
const handleSizeChange = (size) => {
  usersStore.pagination.pageSize = size
  usersStore.fetchUserList()
}

// 当前页变更
const handleCurrentChange = (page) => {
  usersStore.pagination.currentPage = page
  usersStore.fetchUserList()
}

// 对话框关闭
const handleDialogClose = () => {
  currentUser.value = null
}

// 获取角色标签类型
const getRoleTagType = (role) => {
  const typeMap = {
    admin: 'danger',
    manager: 'warning',
    user: 'success',
  }
  return typeMap[role] || 'info'
}

// 获取角色文本
const getRoleText = (role) => {
  const textMap = {
    admin: '管理员',
    manager: '经理',
    user: '普通用户',
  }
  return textMap[role] || role
}

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 组件挂载时获取数据
onMounted(() => {
  usersStore.fetchUserList()
})
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.user-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  text-align: center;
}

.user-info {
  width: 100%;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item label {
  width: 80px;
  font-weight: bold;
  color: #606266;
  flex-shrink: 0;
}

.info-item span {
  flex: 1;
  color: #303133;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-section,
  .action-section {
    justify-content: center;
  }
}
</style>
