<script setup>
import { computed, ref, watch } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import NoteLayer from '@/components/notes/NoteLayer.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { BASEMAP_URLS } from '@/helpers/constants'
import SiteLayer from '@/components/sites/SiteLayer.vue'
import { useSiteStore } from '@/stores/SiteStore'
import MeasureLayer from './MeasureLayer.vue'
import GeolocationLayer from './GeolocationLayer.vue'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore()
const { mapRef, basemap, zoom, center } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { addNewNoteMarker } = noteStore
const { isDisplayingNoteCursor } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { setSiteMarker } = siteStore
const { isCreatingSite, isEditingSite, selectedSiteFeature } = storeToRefs(siteStore)

const mapLayerConfigStore = useMapLayerConfigStore()
const { tempLayerConfig } = storeToRefs(mapLayerConfigStore)
const { initializeMap } = mapLayerConfigStore

const projection = ref('EPSG:3857')
const rotation = ref(0)

function handleClickMap(event) {
  if (isDisplayingNoteCursor.value) {
    addNewNoteMarker(event.coordinate)
    isDisplayingNoteCursor.value = false
    return
  }

  // update the coordinate of selected site while editing
  if (selectedSiteFeature.value && isEditingSite.value) {
    selectedSiteFeature.value?.getGeometry()?.setCoordinates(event.coordinate)
    setSiteMarker(event.coordinate)
    return
  }

  if (isCreatingSite.value) {
    setSiteMarker(event.coordinate)
    return
  }
}

const basemapUrl = computed(() => BASEMAP_URLS[basemap.value])

// watch(tempLayerConfig, (config) => initializeMap(config))
</script>

<template>
  <div
    class="absolute inset-0"
    :class="{
      'hover:cursor-crosshair': isDisplayingNoteCursor || isCreatingSite || isEditingSite,
    }"
  >
    <ol-map class="h-full" :controls="[]" ref="mapRef" @click="handleClickMap">
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />

      <ol-tile-layer>
        <ol-source-xyz :url="basemapUrl" />
      </ol-tile-layer>

      <GeolocationLayer />
      <MeasureLayer />
      <NoteLayer />
      <SiteLayer />
      <MapControls :is-panel-active="isPanelActive" :map="mapRef" />
    </ol-map>
  </div>
</template>

<style></style>
