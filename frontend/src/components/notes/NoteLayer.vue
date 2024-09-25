<script setup>
import { useNoteStore } from '@/stores/NoteStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import MapNoteOverlay from './MapNoteOverlay.vue'

const strokeColor = ref('rgba(255, 255, 255, 0.4)')
const fillColor = ref('#FFFFFF')
const radius = ref(10)

const noteStore = useNoteStore()
const { displayedNotes, selectedNote, selectNoteInteractionRef, noteSourceRef, noteOverlayRef } =
  storeToRefs(noteStore)
const { resetNoteOverlay } = noteStore

function featureSelected(event) {
  const deselectedFeatures = event.deselected

  if (deselectedFeatures.length > 0) {
    resetNoteOverlay()
  }

  const features = event.selected

  if (features.length === 0 || !noteOverlayRef.value) {
    return
  }

  selectedNote.value = features[0].getProperties()
}

// Set position for the overlay on the map
watch(selectedNote, (value) => {
  if (value) {
    noteOverlayRef.value.setPosition(value.geom.coordinates)
  } else {
    selectNoteInteractionRef.value.select.getFeatures().clear()
    noteOverlayRef.value.setPosition(null)
  }
})

</script>

<template>
  <ol-vector-layer>
    <ol-source-vector ref="noteSourceRef">
      <ol-feature v-for="data in displayedNotes" :properties="data" :key="data.id">
        <ol-geom-point :coordinates="data.geom.coordinates"></ol-geom-point>
        <ol-style>
          <ol-style-circle :radius="radius">
            <ol-style-fill :color="fillColor"></ol-style-fill>
            <ol-style-stroke :color="strokeColor" :width="10"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>

  <ol-interaction-select @select="featureSelected" ref="selectNoteInteractionRef">
    <ol-style>
      <ol-style-circle :radius="16">
        <ol-style-fill :color="fillColor"></ol-style-fill>
        <ol-style-stroke :color="strokeColor" :width="16"></ol-style-stroke>
      </ol-style-circle>
    </ol-style>
  </ol-interaction-select>

  <ol-overlay :autoPan="true" ref="noteOverlayRef" :stopEvent="true" :offset="[32, -16]">
    <div class="rounded bg-white shadow-[0px_0px_6px_4px_#0000001F]">
      <MapNoteOverlay />
      <div class="absolute -left-2 top-3 h-4 w-4 rotate-45 bg-white"></div>
    </div>
  </ol-overlay>
</template>
