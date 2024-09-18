<template>
  <div class="absolute inset-0">
    <ol-map class="h-full" :controls="[]">
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-map>
  </div>
</template>

<script setup>
import { fromLonLat } from 'ol/proj'
import { ref } from 'vue'

const center = ref(fromLonLat([-68.3468, -23.1304]))
const projection = ref('EPSG:3857')
const zoom = ref(5)
const rotation = ref(0)
</script>

<style>
.ol-attribution {
  display: none;
}
</style>
