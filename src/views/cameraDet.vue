<template>
  <div class="camera-detection-container">
    <el-card shadow="never" class="control-card">
      <template #header>
        <div class="card-header">
          <h3>
            <el-icon><CameraFilled /></el-icon>
            摄像头实时检测
          </h3>
        </div>
      </template>
      
      <div class="control-area">
        <el-button 
          type="primary" 
          @click="startCamera" 
          :disabled="isCameraActive"
          :loading="isLoading"
        >
          <el-icon><VideoCamera /></el-icon>
          开启摄像头
        </el-button>
        <el-button 
          type="danger" 
          @click="stopCamera" 
          :disabled="!isCameraActive"
        >
          <el-icon><SwitchButton /></el-icon>
          停止检测
        </el-button>
      </div>
    </el-card>

    <div class="detection-area">
      
      <el-row :gutter="25" justify="center">
        <el-col :span="15">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <h3>检测结果</h3>
                <el-tag type="success">AI分析</el-tag>
              </div>
            </template>
            <canvas 
              ref="resultCanvas" 
              class="result-canvas"
              v-show="isCameraActive"
            ></canvas>
            <el-empty v-if="!isCameraActive" description="等待检测结果" />
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { VideoCamera } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const resultCanvas = ref(null)
const isCameraActive = ref(false)
const isLoading = ref(false)
const ws = ref(null)

const connectWebSocket = () => {
  isLoading.value = true
  if(ws.value) ws.value.close()
  
  // 使用相对路径连接WebSocket
  // ws.value = new WebSocket('/ws/ws-realtime-detection')
  const wsUrl = `${location.origin.replace(/^http/, 'ws')}/ws/ws-realtime-detection`
  ws.value = new WebSocket(wsUrl)
  ws.value.binaryType = 'arraybuffer'
  
  // 添加心跳检测
  const heartbeatInterval = setInterval(() => {
    if(ws.value.readyState === WebSocket.OPEN) {
      ws.value.send('ping')
    }
  }, 30000)
  
  ws.value.onopen = () => {
    isCameraActive.value = true
    isLoading.value = false
  }
  
  ws.value.onclose = () => {
    clearInterval(heartbeatInterval)
    if(isCameraActive.value) {  // 只有主动激活状态下才提示
      ElMessage.warning({
        message: '连接已断开，正在尝试重连...',
        duration: 3000
      })
      setTimeout(() => {
        if(isCameraActive.value) connectWebSocket()  // 自动重连
      }, 2000)
    }
  }
  
  ws.value.onmessage = (event) => {
    const blob = new Blob([event.data], {type: 'image/jpeg'})
    const url = URL.createObjectURL(blob)
    
    const ctx = resultCanvas.value.getContext('2d')
    const img = new Image()
    img.onload = () => {
      resultCanvas.value.width = img.naturalWidth || img.width
      resultCanvas.value.height = img.naturalHeight || img.height
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }
  
  ws.value.onerror = (error) => {
    ElMessage.error('连接错误: ' + error.message)
    stopCamera()
  }
}

const startCamera = () => {
  connectWebSocket()
}

const stopCamera = () => {
  if(ws.value) {
    ws.value.close()
    ws.value = null
  }
  isCameraActive.value = false
}

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.camera-detection-container {
  padding: 16px;
}

.control-card {
  margin-bottom: 16px;
}

.control-area {
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 10px;
}


.result-canvas {
  width: 100%;
  max-height: 480px;
  border-radius: 4px;
  background: #000;
}

.detection-area {
  margin: 0 auto;
  max-width: auto;
  text-align: center;
  margin-top: 20px;
}

/* 添加状态显示样式 */
.connection-status {
  margin-top: 10px;
  padding: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  text-align: center;
}
</style>
