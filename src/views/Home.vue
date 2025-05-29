<template>
  <div class="home-container">
    <el-card shadow="hover" class="welcome-card">
      <template #header>
        <div class="card-header">
          <h2>
            <el-icon><HomeFilled /></el-icon>
            欢迎使用YOLOv12目标检测平台
          </h2>
        </div>
      </template>
      
      <div class="welcome-content">
        <el-row :gutter="20">
          <el-col :span="8" v-for="(item, index) in features" :key="index">
            <el-card shadow="never" class="feature-card">
              <div class="feature-icon">
                <el-icon :size="40" :color="item.color">
                  <component :is="item.icon" />
                </el-icon>
              </div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.desc }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { HomeFilled, PictureFilled, VideoCameraFilled, CameraFilled } from '@element-plus/icons-vue'

const features = [
  {
    icon: PictureFilled,
    title: '图像检测',
    desc: '上传单张图片进行目标检测',
    color: '#67C23A'
  },
  {
    icon: VideoCameraFilled,
    title: '视频检测',
    desc: '上传视频文件进行目标检测',
    color: '#409EFF'
  },
  {
    icon: CameraFilled,
    title: '实时检测',
    desc: '使用摄像头进行实时目标检测',
    color: '#E6A23C'
  }
]
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.welcome-card {
  border-radius: 8px;
}

.card-header {
  text-align: center;
  padding: 20px 0;
}

.card-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0;
}

.welcome-content {
  margin-top: 20px;
}

.feature-card {
  height: 100%;
  text-align: center;
  border: none;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  margin-bottom: 15px;
}

.feature-card h3 {
  color: #333;
  margin-bottom: 10px;
}

.feature-card p {
  color: #666;
  font-size: 14px;
}
</style>