<script setup>
import { computed, ref, watch } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import NoteLayer from '@/components/notes/NoteLayer.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { BASEMAP_URLS, LEFT_PANELS } from '@/helpers/constants'
import SiteLayer from '@/components/sites/SiteLayer.vue'
import { useSiteStore } from '@/stores/SiteStore'
import MeasureLayer from './MeasureLayer.vue'
import GeolocationLayer from './GeolocationLayer.vue'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'

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
const { refreshMap } = mapLayerConfigStore

const leftPanelStore = useLeftPanelStore()
const { setTab } = leftPanelStore
const { activePanel } = storeToRefs(leftPanelStore)

const projection = ref('EPSG:3857')
const rotation = ref(0)

function handleClickMap(event) {
  if (isDisplayingNoteCursor.value) {
    addNewNoteMarker(event.coordinate)
    isDisplayingNoteCursor.value = false
    return
  }

  if (isCreatingSite.value || isEditingSite.value) {
    setSiteMarker(event.coordinate)
    return
  }

  const features = mapRef.value.map.getFeaturesAtPixel(event.pixel, {
    layerFilter: (layerCandidate) => layerCandidate.get('name') === 'efeo:efeo_site',
  })

  if (features.length === 0) {
    selectedSiteFeature.value = null
    activePanel.value = null
    return
  }

  selectedSiteFeature.value = features[0]
  setTab(LEFT_PANELS.IDENTIFY)
}

const basemapUrl = computed(() => BASEMAP_URLS[basemap.value])

watch(
  tempLayerConfig,
  (config) => {
    refreshMap(config)
  },
  { deep: true },
)
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
