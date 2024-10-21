<script setup>
import { transform } from 'ol/proj'
import { onMounted, ref } from 'vue'

const props = defineProps({
  radius: Number,
  fillColor: String,
  strokeColor: String,
  site: Object,
})

const featureRef = ref()

const transfromSiteCoordinate = (coordinates) => {
  return transform(coordinates, 'EPSG:4326', 'EPSG:3857')
}

onMounted(() => {
  featureRef.value?.feature.setId(props.site.id)
})
</script>

<template>
  <ol-feature ref="featureRef" :key="site.id" :properties="{ ...props.site, type: 'site' }">
    <ol-geom-point :coordinates="transfromSiteCoordinate(props.site?.location?.coordinates)" />
    <ol-style>
      <ol-style-circle :radius="radius">
        <ol-style-stroke :strokeWidth="1" :color="strokeColor"></ol-style-stroke>
        <ol-style-fill :color="fillColor"></ol-style-fill>
      </ol-style-circle>
    </ol-style>
  </ol-feature>
</template>
