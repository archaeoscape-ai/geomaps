<script setup>
import { useMapStore } from '@/stores/MapStore'
import { fromLonLat } from 'ol/proj'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

const position = ref([])
const positionFeature = ref(null)
const radius = ref(6)
const fillColor = ref('#3399CC')
const strokeColor = ref('#fff')
const projection = ref('EPSG:4326')

const vectorLayer = ref()
const geolocationRef = ref()
const selectInteractionRef = ref()
const overlayRef = ref()

const mapStore = useMapStore()
const { tracking, mapRef } = storeToRefs(mapStore)

const geoLocChange = (event) => {
  position.value = event.target.getPosition()
  mapRef.value.map.getView().setCenter(fromLonLat(position.value))
  mapRef.value.map.getView().setZoom(7)
}

onMounted(() => {
  geolocationRef.value.geoLoc.setTracking(false)
})

watch(tracking, () => {
  geolocationRef.value.geoLoc.setTracking(tracking.value)
  geolocationRef.value.geoLoc.changed()
  if (!tracking.value) {
    overlayRef.value.setPosition(null)
  } else if (position.value) {
    mapRef.value.map.getView().setCenter(fromLonLat(position.value))
    mapRef.value.map.getView().setZoom(7)
  }
})

function featureSelected(event) {
  const deselectedFeatures = event.deselected

  if (deselectedFeatures.length > 0) {
    overlayRef.value.setPosition(null)
  }

  const features = event.selected

  if (features.length === 0) {
    return
  }

  overlayRef.value.setPosition(fromLonLat(position.value))
}

const selectInteactionFilter = (feature) => {
  return feature.getProperties().name === 'current-location'
}
</script>

<template>
  <ol-geolocation
    ref="geolocationRef"
    :projection="projection"
    @change:position="geoLocChange"
    :tracking="tracking"
  >
    <template>
      <ol-vector-layer :zIndex="2" ref="vectorLayer">
        <ol-source-vector>
          <ol-feature
            ref="positionFeature"
            v-if="tracking"
            :properties="{ name: 'current-location' }"
          >
            <ol-geom-point :coordinates="fromLonLat(position)"></ol-geom-point>
            <ol-style>
              <ol-style-circle :radius="radius">
                <ol-style-fill :color="fillColor"></ol-style-fill>
                <ol-style-stroke :color="strokeColor" :width="2"></ol-style-stroke>
              </ol-style-circle>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>
      <ol-interaction-select
        @select="featureSelected"
        ref="selectInteractionRef"
        :filter="selectInteactionFilter"
      >
        <ol-style>
          <ol-style-circle :radius="radius">
            <ol-style-fill :color="fillColor"></ol-style-fill>
            <ol-style-stroke :color="strokeColor" :width="3"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-interaction-select>

      <ol-overlay :autoPan="true" ref="overlayRef" :stopEvent="true" :offset="[20, -18]">
        <div class="rounded bg-white shadow-[0px_0px_6px_4px_#0000001F]">
          <div class="flex flex-col gap-2 p-4 text-sm">
            <p>Your location is:</p>
            <p class="font-medium">{{ position.join(', ') }}</p>
          </div>
          <div class="absolute -left-2 top-3 h-4 w-4 rotate-45 bg-white"></div>
        </div>
      </ol-overlay>
    </template>
  </ol-geolocation>
</template>
