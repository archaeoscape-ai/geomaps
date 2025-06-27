<script setup>
import osmBasicBackground from '@/assets/osm-basic.png'
import esriImageryBackground from '@/assets/esri-imagery.png'
import { ref } from 'vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import { BASEMAPS } from '@/helpers/constants'

defineProps({
  isPanelActive: Boolean,
})

const osmBasicBackgroundUrl = ref(`url(${osmBasicBackground})`)
const esriImageryBackgroundUrl = ref(`url(${esriImageryBackground})`)

const mapStore = useMapStore()
const { basemap } = storeToRefs(mapStore)

function selectBasemap(map) {
  basemap.value = map
}
</script>

<template>
  <div
    class="absolute bottom-4 right-4 flex flex-col gap-4"
    :class="{
      'translate-x-0': !isPanelActive,
      '-translate-x-96': isPanelActive,
    }"
  >
    <button
      class="osm-background h-12 w-12 rounded-md shadow-md"
      @click="selectBasemap(BASEMAPS.OSM)"
      :class="{
        'border-2 border-primary': basemap === BASEMAPS.OSM,
      }"
    ></button>

    <button
      class="esri-background h-12 w-12 rounded-md shadow-md"
      @click="selectBasemap(BASEMAPS.ESRI)"
      :class="{
        'border-2 border-primary': basemap === BASEMAPS.ESRI,
      }"
    ></button>
  </div>
</template>

<style lang="postcss" scoped>
.osm-background {
  background-image: v-bind(osmBasicBackgroundUrl);
  background-size: cover;
}
.esri-background {
  background-image: v-bind(esriImageryBackgroundUrl);
  background-size: cover;
}
</style>
