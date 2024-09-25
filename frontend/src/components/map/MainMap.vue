<script setup>
import { fromLonLat } from 'ol/proj'
import { computed, ref } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import NoteLayer from '@/components/notes/NoteLayer.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { BASEMAP_URLS } from '@/helpers/constants'

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore()
const { mapRef, basemap, zoom, center } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { addNewNoteMarker } = noteStore
const { isAddingNote } = storeToRefs(noteStore)

const projection = ref('EPSG:3857')
const rotation = ref(0)

function handleClickMap(event) {
  if (isAddingNote.value) {
    addNewNoteMarker(event.coordinate)
    isAddingNote.value = false
    return
  }
}

const basemapUrl = computed(() => BASEMAP_URLS[basemap.value])
</script>

<template>
  <div class="absolute inset-0">
    <ol-map
      class="h-full"
      :controls="[]"
      ref="mapRef"
      :class="{
        'hover:cursor-crosshair': isAddingNote,
      }"
      @click="handleClickMap"
    >
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

      <NoteLayer />
    </ol-map>

    <MapControls :is-panel-active="isPanelActive" :map="mapRef" />
  </div>
</template>

<style>
.ol-attribution {
  display: none;
}
</style>
