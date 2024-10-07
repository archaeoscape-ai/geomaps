<script setup>
import { computed, ref } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import NoteLayer from '@/components/notes/NoteLayer.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { BASEMAP_URLS, RIGHT_PANELS } from '@/helpers/constants'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import SiteIdentifyLayer from '@/components/sites/SiteIdentifyLayer.vue'
import { useSiteStore } from '@/stores/SiteStore'
import MeasureLayer from './MeasureLayer.vue'
import GeolocationLayer from './GeolocationLayer.vue'

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore()
const { mapRef, basemap, zoom, center } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { addNewNoteMarker } = noteStore
const { isAddingNote } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { setSiteMarker } = siteStore
const { isCreatingSite, isEditingSite } = storeToRefs(siteStore)

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
    setSiteMarker(event.coordinate)
    return
  }
}

const basemapUrl = computed(() => BASEMAP_URLS[basemap.value])
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

      <SiteIdentifyLayer />
    </ol-map>

    <MapControls :is-panel-active="isPanelActive" :map="mapRef" />
  </div>
</template>

<style>
.ol-attribution {
  display: none;
}
</style>
