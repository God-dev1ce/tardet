<template>
  <div class="image-detection-container">
    <!-- 上传区域 - 使用浅色背景 -->
    <el-card shadow="never" class="upload-section">
      <template #header>
        <div class="section-header">
          <h3 style="font-size: 16px;">
            <el-icon><PictureFilled /></el-icon>
            图片目标检测
          </h3>
        </div>
      </template>
      
      <div class="upload-area">
        <el-upload
          class="elegant-upload"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleFileChange"
          :before-upload="() => false"
        >
          <el-button 
            type="primary" 
            plain 
            :loading="uploading"
            class="upload-btn"
          >
            <el-icon class="upload-icon"><upload-filled /></el-icon>
            <span>选择图片</span>
          </el-button>
          <div class="el-upload__tip">
            <span class="format-tip">支持JPG/PNG格式</span>
            <span class="size-tip">建议尺寸≤2000x2000</span>
          </div>
        </el-upload>
      </div>
    </el-card>

    <!-- 结果区域 - 使用深色背景和明显分隔 -->
    <div v-if="previewImage" class="result-section">
      <div class="section-divider">
        <el-divider>
          <span class="divider-text">检测结果</span>
        </el-divider>
      </div>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="image-card">
            <template #header>
              <div class="card-header">
                <h3>原始图片</h3>
                <el-tag>原图</el-tag>
              </div>
            </template>
            <img :src="previewImage" alt="原图预览" class="result-image" />
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover" class="result-card">
            <template #header>
              <div class="card-header">
                <h3>检测结果</h3>
                <el-tag type="success">AI分析</el-tag>
              </div>
            </template>
            <img 
              v-if="resultImage"
              :src="resultImage" 
              alt="检测结果" 
              class="result-image" />
            <el-empty v-else description="等待检测结果" />
          </el-card>
        </el-col>
      </el-row>

      <el-card shadow="hover" class="data-card" v-if="detectionData.length > 0">
        <template #header>
          <div class="card-header">
            <h3>检测数据</h3>
            <el-tag type="info">共 {{ detectionData.length }} 个目标</el-tag>
          </div>
        </template>
        
        <el-table
          :data="detectionData"
          border
          stripe
          highlight-current-row
          style="width: 100%"
          max-height="400"
        >
          <el-table-column prop="class" label="类别ID" width="100" align="center" />
          <el-table-column prop="name" label="类别名称" width="120" align="center" />
          <el-table-column label="置信度" width="120" align="center">
            <template #default="{row}">
              <el-progress 
                :percentage="row.confidence * 100" 
                :show-text="false"
                :color="getConfidenceColor(row.confidence)" />
              {{ (row.confidence * 100).toFixed(1) }}%
            </template>
          </el-table-column>
          <el-table-column label="边界框" align="center">
            <template #default="{row}">
              [{{ row.bbox.join(', ') }}]
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled, PictureFilled } from '@element-plus/icons-vue'  // 修改为PictureFilled图标
import axios from 'axios'
import { ElMessage } from 'element-plus'

const imageFile = ref(null)
const previewImage = ref(null)   // 本地预览图 URL
const resultImage = ref(null)    // 后台返回检测图
const detectionData = ref([])    // 识别框信息列表
const uploading = ref(false)

const handleFileChange = (file) => {
  if (!file.raw) return

  // 释放旧 URL，避免内存泄漏
  if (previewImage.value) {
    URL.revokeObjectURL(previewImage.value)
  }

  imageFile.value = file.raw
  previewImage.value = URL.createObjectURL(file.raw)
  resultImage.value = null
  detectionData.value = []
  uploadImage()
}

const uploadImage = async () => {
  if (!imageFile.value) return

  uploading.value = true
  ElMessage.info('正在上传并检测，请稍候...')
  console.time('检测耗时') // 开始计时

  const formData = new FormData()
  formData.append('file', imageFile.value)

  try {
    const res = await axios.post('/api/image-detect/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log(`上传进度: ${percentCompleted}%`)
      }
    })
    
    console.timeEnd('检测耗时') // 结束计时并输出耗时
    console.log('检测结果:', JSON.stringify(res.data, null, 2))

    resultImage.value = `data:image/jpeg;base64,${res.data.image}`
    detectionData.value = res.data.detections || []

    ElMessage.success('检测完成！')
  } catch (error) {
    console.timeEnd('检测耗时') // 即使出错也结束计时
    console.error('检测错误:', error.response ? error.response.data : error.message)
    ElMessage.error('检测失败，请重试')
  } finally {
    uploading.value = false
  }
}

function getConfidenceColor(confidence) {
  if (confidence > 0.8) return '#67C23A'
  if (confidence > 0.5) return '#E6A23C'
  return '#F56C6C'
}
</script>

<style scoped>
.image-detection-container {
  padding: 16px;
}

.upload-card {
  margin-bottom: 16px;
  border: none;
  background-color: #f8fafc;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  color: #333;
}

.elegant-upload {
  padding: 0 16px 16px;
}

.upload-btn {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  transition: all 0.3s;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.upload-icon {
  margin-right: 6px;
}

.el-upload__tip {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
}

.format-tip {
  color: var(--el-text-color-secondary);
}

.size-tip {
  color: var(--el-color-info);
}

.result-container {
  margin-top: 20px;
}

.result-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  border-radius: 4px;
}

.data-card {
  margin-top: 20px;
  border-radius: 8px;
}
</style>


<style scoped>
/* 新增居中样式 */
.upload-section {
  margin: 0 auto;
  max-width: auto;
  text-align: center;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-light);  /* 更细的边框 */
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.elegant-upload {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
