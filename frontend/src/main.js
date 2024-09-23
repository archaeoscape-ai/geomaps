import './bootstrap'

import { createApp } from 'vue'
import 'vue3-openlayers/styles.css'
import OpenLayersMap from 'vue3-openlayers'
import App from './App.vue'
import './assets/index.css'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/AuthStore'
import { getCookie } from '@/helpers/cookies'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(OpenLayersMap)
app.use(pinia)

const { setIsLoggedIn } = useAuthStore()
const authToken = getCookie('accessToken')
if (authToken) {
  setIsLoggedIn(true)
}

app.mount('#app')
