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
import _ from 'lodash'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'

register(proj4)

const app = createApp(App)
const pinia = createPinia()

pinia.use(({ store }) => {
  const initialState = _.cloneDeep(store.$state)
  store.$reset = () => {
    // Custom reset
    if (typeof store.reset === 'function') {
      store.reset()
    }
    store.$patch(($state) => {
      Object.assign($state, initialState)
    })
  }
})

app.use(router)
app.use(OpenLayersMap)
app.use(pinia)

const { setIsLoggedIn } = useAuthStore()
const authToken = getCookie('accessToken')
if (authToken) {
  setIsLoggedIn(true)
}

app.mount('#app')
