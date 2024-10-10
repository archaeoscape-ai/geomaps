<script setup>
import { computed, inject, ref, watch } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import NoteLayer from '@/components/notes/NoteLayer.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { BASEMAP_URLS, LAYER_TYPE, RIGHT_PANELS } from '@/helpers/constants'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import SiteLayer from '@/components/sites/SiteLayer.vue'
import { useSiteStore } from '@/stores/SiteStore'
import MeasureLayer from './MeasureLayer.vue'
import GeolocationLayer from './GeolocationLayer.vue'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore()
const { mapRef, basemap, zoom, center, currentMap } = storeToRefs(mapStore)

const mapLayerConfigStore = useMapLayerConfigStore()
const { tempLayerConfigWithLayerDetail } = storeToRefs(mapLayerConfigStore)

const noteStore = useNoteStore()
const { addNewNoteMarker } = noteStore
const { isAddingNote } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { setSiteMarker } = siteStore
const { isCreatingSite, isEditingSite, selectedSiteFeature } = storeToRefs(siteStore)

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

const projection = ref('EPSG:3857')
const rotation = ref(0)
const format = inject('ol-format')
const mvtFormat = new format.MVT()

function handleClickMap(event) {
  if (isAddingNote.value) {
    addNewNoteMarker(event.coordinate)
    isAddingNote.value = false
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

watch(tempLayerConfigWithLayerDetail, () => console.log(tempLayerConfigWithLayerDetail.value))
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
      <MapControls :is-panel-active="isPanelActive" :map="mapRef" />

      <template v-for="group in tempLayerConfigWithLayerDetail" :key="group.id">
        <template v-for="layer in group.items" :key="`${group.id}-${layer.id}`">
          <ol-vector-tile-layer
            v-if="group.id === LAYER_TYPE.VECTOR"
            :visible="layer.isActive"
            :opacity="layer.opacity / 100"
            :zIndex="layer.zIndex"
          >
            <ol-source-vector-tile :url="layer.layerDetail.tiles_url" :format="mvtFormat">
            </ol-source-vector-tile>
          </ol-vector-tile-layer>

          <ol-tile-layer
            v-else
            :visible="layer.isActive"
            :opacity="layer.opacity / 100"
            :zIndex="layer.zIndex"
          >
            <ol-source-xyz v-if="group.id === LAYER_TYPE.XYZ" :url="layer.layerDetail.tiles_url" />
            <ol-source-tile-wms
              v-else-if="group.id === LAYER_TYPE.WMS"
              :url="layer.layerDetail.wms_url"
            />
          </ol-tile-layer>
        </template>
      </template>
    </ol-map>
  </div>
</template>

<style></style>
