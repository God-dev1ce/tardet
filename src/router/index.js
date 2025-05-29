import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import imageDet from '../views/imageDet.vue'
import videoDet from '../views/videoDet.vue'
import cameraDet from '../views/cameraDet.vue'

const routes = [
  { path: '/',  name: '首页',component: Home }, 
  { path: '/imageDet',  name: '图像检测',component: imageDet }, 
  { path: '/videoDet',  name: '视频检测',component: videoDet },
  { path: '/cameraDet',  name: '摄像头实时检测',component: cameraDet }
]


export default createRouter({
  history: createWebHistory(),
  routes
})
