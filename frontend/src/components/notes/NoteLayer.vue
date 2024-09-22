<script setup>
import { RIGHT_PANELS } from '@/helpers/constants'
import { useNoteStore } from '@/stores/NoteStore'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import MapNoteOverlay from './MapNoteOverlay.vue'

const strokeColor = ref('rgba(255, 255, 255, 0.4)')
const fillColor = ref('#FFFFFF')
const radius = ref(10)

/**
 * @type {import('vue').Ref<{ select: import('ol/interaction').Select } | null>}
 */
const selectNoteInteractionRef = ref(null)

/**
 * @type {import('vue').Ref<{ source: import('ol/source/Vector').default } | null>}
 */
const noteSourceRef = ref(null)

/**
 * @type {import('vue').Ref<{ overlay: import('ol/Overlay').default } | null>}
 */
const noteOverlayRef = ref(null)

const noteStore = useNoteStore()
const { displayedNotes, selectedNote } = storeToRefs(noteStore)
const { resetNoteOverlay } = noteStore

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

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
  console.log(selectedNote.value)
}

watch(selectedNote, (value) => {
  if (value) {
    noteOverlayRef.value.overlay.setPosition(value.geom.coordinates)
  } else {
    selectNoteInteractionRef.value.select.getFeatures().clear()
  }
})
</script>

<template>
  <ol-vector-layer v-if="activePanel === RIGHT_PANELS.NOTE">
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

  <ol-overlay :auto-pan="true" ref="noteOverlayRef" :stopEvent="true">
    <template v-if="selectedNote && activePanel === RIGHT_PANELS.NOTE">
      <div
        class="absolute -top-6 left-8 min-w-[350px] max-w-sm cursor-default rounded bg-white shadow-[0px_0px_6px_4px_#0000001F]"
      >
        <MapNoteOverlay />
      </div>
      <div class="absolute -top-2.5 left-6 h-4 w-4 rotate-45 bg-white"></div>
    </template>
  </ol-overlay>
</template>
