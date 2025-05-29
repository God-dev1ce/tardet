<template>
  <el-container style="height: 100vh">
    <!-- 侧边导航栏 -->
    <el-aside width="220px" style="background-color: #001529">
      <div class="logo">后台管理</div>
      <el-menu
        router
        default-active="/"
        class="el-menu-vertical-demo"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/imageDet">
          <el-icon><PictureFilled /></el-icon>
          <span>图像检测</span>
        </el-menu-item>
        <el-menu-item index="/videodet">
          <el-icon><VideoCameraFilled /></el-icon>
          <span>视频检测</span>
        </el-menu-item>
        <el-menu-item index="/cameraDet">
          <el-icon><CameraFilled /></el-icon>
          <span>摄像头实时检测</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体区域 -->
    <el-container>
      <el-header class="header">
        <div class="header-title">🎥 YOLOv12 目标检测平台</div>
      </el-header>
      <el-main class="main">
        <el-card shadow="hover">
          <router-view />
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { HomeFilled, PictureFilled, VideoCameraFilled, CameraFilled } from '@element-plus/icons-vue'
</script>

<style scoped>
.logo {
  color: #fff;
  font-size: 20px;
  text-align: center;
  padding: 20px 0;
  font-weight: bold;
  border-bottom: 1px solid #2c3e50;
}

.header {
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  padding-left: 20px;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #ddd;
}

.main {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 64px);
}
</style>
