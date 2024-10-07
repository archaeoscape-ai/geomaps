<script setup>
import { transform } from 'ol/proj'
import { onMounted, ref } from 'vue'

const featureRef = ref()
const strokeColor = ref('rgba(255, 255, 255, 0.2)')
const fillColor = ref('#3ca23c')
const radius = ref(10)

const props = defineProps({
  site: Object,
})

const transfromSiteCoordinate = (coordinates) => {
  return transform(coordinates, 'EPSG:4326', 'EPSG:3857')
}

onMounted(() => {
  featureRef.value?.feature.setId(props.site.id)
})
</script>

<template>
  <ol-feature ref="featureRef" :key="props.site.id" :properties="{ ...props.site, type: 'site' }">
    <ol-geom-point :coordinates="transfromSiteCoordinate(props.site?.location?.coordinates)" />
    <ol-style>
      <ol-style-circle :radius="radius">
        <ol-style-fill :color="fillColor"></ol-style-fill>
        <ol-style-stroke :color="strokeColor" :width="10"></ol-style-stroke>
      </ol-style-circle>
    </ol-style>
  </ol-feature>
</template>
