import LoginView from '@/components/views/LoginView.vue'
import HomeView from '@/components/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { getActivePinia, storeToRefs } from 'pinia'

const routes = [
  { path: '/login', component: LoginView, name: 'login' },
  {
    path: '/',
    component: HomeView,
    name: 'home',
    meta: {
      label: 'Home',
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const { getAuthUser, resetLoginState } = authStore
  const { isLoggedIn, user } = storeToRefs(authStore)

  getActivePinia()._s.forEach((store) => {
    if (store.$id !== 'auth') {
      store.$reset()
    }
  })

  const needAuth = to.matched.some((record) => record.meta.requiresAuth)

  // If the user is logged in but user data is not available, fetch it
  if (isLoggedIn.value && user.value === null) {
    try {
      await getAuthUser()
    } catch (err) {
      resetLoginState()
      return { name: 'login' }
    }
  }

  // If the user is authenticated and accessing the login, redirect to home
  if (isLoggedIn.value && user.value && to.name === 'login') {
    return { name: 'home' }
  }

  // If the user is authenticated and accessing a page, let them through
  if (isLoggedIn.value && user.value) {
    return true
  }

  // If the route requires authentication and the user is not logged in, redirect to login
  if (!isLoggedIn.value && needAuth) {
    return { name: 'login' }
  }

  return true
})

export default router
