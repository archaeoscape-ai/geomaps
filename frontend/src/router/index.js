import LoginView from '@/components/views/LoginView.vue'
import HomeView from '@/components/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/', component: HomeView }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
