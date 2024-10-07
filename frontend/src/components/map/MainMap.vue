<script setup>
import { computed, ref, watch } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import NoteLayer from '@/components/notes/NoteLayer.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { BASEMAP_URLS, RIGHT_PANELS } from '@/helpers/constants'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import { XYZ } from 'ol/source'
import TileLayer from 'ol/layer/Tile'
import SiteLayer from '@/components/sites/SiteLayer.vue'
import { useSiteStore } from '@/stores/SiteStore'
import MeasureLayer from './MeasureLayer.vue'
import GeolocationLayer from './GeolocationLayer.vue'

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore()
const { mapRef, basemap, zoom, center, currentMap } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { addNewNoteMarker } = noteStore
const { isAddingNote } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { setSiteMarker } = siteStore
const { isCreatingSite, isEditingSite, selectedSite } = storeToRefs(siteStore)

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

const projection = ref('EPSG:3857')
const rotation = ref(0)

function handleClickMap(event) {
  if (isAddingNote.value) {
    addNewNoteMarker(event.coordinate)
    isAddingNote.value = false
    return
  }

  if (isCreatingSite.value || isEditingSite.value) {
    // update the coordinate of selected site while editing
    if (selectedSite.value && isEditingSite.value) {
      selectedSite.value.geometry?.setCoordinates(event.coordinate)
    }
    setSiteMarker(event.coordinate)
    return
  }
}

const basemapUrl = computed(() => BASEMAP_URLS[basemap.value])

watch(currentMap, (newValue) => {
  if (newValue) {
    siteStore.getSites(currentMap.value?.id)
  }
})
</script>

<template>
  <div
    class="absolute inset-0"
    :class="{
      'hover:cursor-crosshair': isAddingNote || isCreatingSite || isEditingSite,
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
      <NoteLayer v-if="activePanel === RIGHT_PANELS.NOTE" />

      <SiteLayer />
    </ol-map>

    <MapControls :is-panel-active="isPanelActive" :map="mapRef" />
  </div>
</template>

<style>
.ol-attribution {
  display: none;
}
</style>
