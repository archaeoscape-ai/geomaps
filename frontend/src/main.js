import { createApp } from "vue";
import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";
import App from "./App.vue";
import "./assets/index.css";
import { router } from "./router";

const app = createApp(App)

app.use(router)
app.use(OpenLayersMap)

app.mount('#app')