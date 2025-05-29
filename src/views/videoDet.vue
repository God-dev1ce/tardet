<template>
  <div class="video-detection-container">
    <el-card shadow="never" class="upload-card">
      <template #header>
        <div class="card-header">
          <h3 style="font-size: 16px;">
            <el-icon><video-camera-filled /></el-icon>
            视频目标检测
          </h3>
        </div>
      </template>
      
      <el-upload
        class="upload-demo"
        action="#"
        :http-request="handleUpload"
        :show-file-list="false"
        accept="video/*"
        :disabled="isDetecting"
      >
        <el-button type="primary" plain :loading="isDetecting">  <!-- 使用普通按钮样式 -->
          <el-icon><upload-filled /></el-icon>
          选择视频文件
        </el-button>
        <div class="el-upload__tip">
          支持MP4/AVI/MOV格式，≤500MB
        </div>
      </el-upload>
    </el-card>

    <div v-if="videoUrl" class="result-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>原始视频</h3>
                <el-tag>原始文件</el-tag>
              </div>
            </template>
            <video :src="videoUrl" controls class="video-preview"></video>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>检测结果</h3>
                <el-tag type="success">AI分析</el-tag>
              </div>
            </template>
            <video 
              v-if="processedVideoUrl"
              :src="processedVideoUrl" 
              controls 
              class="video-preview"
              type="video/mp4">
            </video>
            <el-empty v-else description="等待检测结果" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled, VideoCameraFilled } from '@element-plus/icons-vue'  // 新增VideoCameraFilled图标
import axios from 'axios'

const videoUrl = ref(null)
const processedVideoUrl = ref(null)
const isDetecting = ref(false)
const progress = ref(0)
const progressMessage = ref('')
const progressStatus = ref('')

async function handleUpload(options) {
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    videoUrl.value = e.target.result
  }
  reader.readAsDataURL(file)
  
  try {
    isDetecting.value = true
    progressMessage.value = '正在上传视频...'
    
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await axios.post('/api/video-detect/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progressEvent => {
        progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      }
    })
    
    progressStatus.value = 'success'
    progressMessage.value = '检测完成'
    processedVideoUrl.value = `data:video/mp4;base64,${response.data.annotated_video}`
    
  } catch (error) {
    progressStatus.value = 'exception'
    progressMessage.value = error.response?.data?.detail || error.message
  } finally {
    isDetecting.value = false
  }
}
</script>

<style scoped>
.video-detection-container {
  padding: 16px;
}

.upload-card {
  margin: 0 auto;
  max-width: auto;
  text-align: center;
  margin-bottom: 16px;
  border: 1px solid var(--el-border-color-light);  /* 更细的边框 */
}

.upload-demo {
  padding: 16px;
  text-align: center;
}

.el-upload__tip {
  font-size: 12px;
  color: var(--el-text-color-placeholder);  /* 更浅的文字颜色 */
  margin-top: 8px;
}

.result-container {
  margin-top: 20px;
}

.video-preview {
  width: 100%;
  max-height: 400px;
  border-radius: 6px;
  background: #000;
}
</style>
