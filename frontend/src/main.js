import { createApp } from "vue";
import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";
import App from "./App.vue";
import "./assets/index.css";
import { router } from "./router";
import { createPinia } from "pinia";

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(OpenLayersMap)
app.use(pinia)

app.mount('#app')