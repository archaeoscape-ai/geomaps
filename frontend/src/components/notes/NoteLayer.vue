<script setup>
import { useNoteStore } from '@/stores/NoteStore'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import MapNoteOverlay from './MapNoteOverlay.vue'
import { useSiteStore } from '@/stores/SiteStore'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import { RIGHT_PANELS } from '@/helpers/constants'
import MarkerIcon from '@/assets/marker.svg?url'

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

const noteStore = useNoteStore()
const {
  displayedNotes,
  selectedNote,
  selectNoteInteractionRef,
  noteSourceRef,
  noteOverlayRef,
  isCreatingNote,
  isEditingNote,
  showNoteLayer,
  isDisplayingNoteCursor,
} = storeToRefs(noteStore)
const { resetNoteOverlay } = noteStore

const siteStore = useSiteStore()
const { isCreatingSite, isEditingSite } = storeToRefs(siteStore)

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

const selectInteactionFilter = (feature) => {
  return !isCreatingSite.value && !isEditingSite.value && feature.getProperties().type === 'note'
}
</script>

<template>
  <ol-vector-layer
    zIndex="1000"
    v-if="
      activePanel === RIGHT_PANELS.NOTE ||
      isCreatingNote ||
      isEditingNote ||
      isDisplayingNoteCursor ||
      selectedNote ||
      showNoteLayer
    "
  >
    <ol-source-vector ref="noteSourceRef">
      <ol-feature
        v-for="data in displayedNotes"
        :properties="{ ...data, type: 'note' }"
        :key="data.id"
      >
        <ol-geom-point :coordinates="data.geom.coordinates"></ol-geom-point>
        <ol-style>
          <ol-style-icon :src="MarkerIcon" :scale="1"></ol-style-icon>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>

  <ol-interaction-select
    @select="featureSelected"
    ref="selectNoteInteractionRef"
    :filter="selectInteactionFilter"
  >
    <ol-style>
      <ol-style-icon :src="MarkerIcon" :scale="1.3"></ol-style-icon>
    </ol-style>
  </ol-interaction-select>

  <ol-overlay :autoPan="true" ref="noteOverlayRef" :stopEvent="true" :offset="[32, -16]">
    <div class="rounded bg-white shadow-[0px_0px_6px_4px_#0000001F]">
      <MapNoteOverlay />
      <div class="absolute -left-2 top-3 h-4 w-4 rotate-45 bg-white"></div>
    </div>
  </ol-overlay>
</template>
