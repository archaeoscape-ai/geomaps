import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as authService from '@/api-services/AuthService'
import { removeCookie, setCookie } from '@/helpers/cookies'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const isLoggingIn = ref(false)
  const error = ref(null)
  const isLoggedIn = ref(false)

  /**
   * Log in with email and password
   */
  async function login({ email, password }) {
    if (isLoggingIn.value) return

    isLoggingIn.value = true
    error.value = null
    try {
      const response = await authService.login({ email, password })
      setCookie('accessToken', response.data.access, 7)
      const data = await authService.getAuthUser()
      user.value = data
      isLoggedIn.value = true
    } catch (err) {
      console.log(err)
      error.value = err
    } finally {
      isLoggingIn.value = false
    }
  }

  async function logout() {
    isLoading.value = true

    try {
      await authService.logout()
      resetLoginState()
      getActivePinia()._s.forEach((store) => {
        if (store.$id !== 'auth') {
          store.$reset()
        }
      })
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  async function getAuthUser() {
    isLoading.value = true
    try {
      const data = await authService.getAuthUser()
      user.value = data
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  function resetLoginState() {
    user.value = null
    removeCookie('accessToken')
    isLoggedIn.value = false
  }

  function setIsLoggedIn(data) {
    isLoggedIn.value = data
  }

  return {
    user,
    isLoading,
    isLoggedIn,
    isLoggingIn,
    error,

    login,
    logout,
    getAuthUser,
    resetLoginState,
    setIsLoggedIn,
  }
})
