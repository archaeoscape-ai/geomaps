<script setup>
import { computed, inject, ref, watch } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import NoteLayer from '@/components/notes/NoteLayer.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { BASEMAP_URLS, LAYER_TYPE } from '@/helpers/constants'
import SiteLayer from '@/components/sites/SiteLayer.vue'
import { useSiteStore } from '@/stores/SiteStore'
import MeasureLayer from './MeasureLayer.vue'
import GeolocationLayer from './GeolocationLayer.vue'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import { VectorTile, Tile as TileLayer } from 'ol/layer'
import { TileWMS, VectorTile as VectorTileSource, XYZ } from 'ol/source'

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore()
const { mapRef, basemap, zoom, center, currentMap } = storeToRefs(mapStore)

const mapLayerConfigStore = useMapLayerConfigStore()
const { tempLayerConfigWithLayerDetail } = storeToRefs(mapLayerConfigStore)

const noteStore = useNoteStore()
const { addNewNoteMarker } = noteStore
const { isDisplayingNoteCursor } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { setSiteMarker } = siteStore
const { isCreatingSite, isEditingSite, selectedSiteFeature } = storeToRefs(siteStore)

const projection = ref('EPSG:3857')
const rotation = ref(0)
const format = inject('ol-format')
const mvtFormat = new format.MVT()

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

watch(currentMap, (newValue) => {
  if (newValue) {
    siteStore.getSites(newValue.id)
    siteStore.getSitesGeom(newValue.id)
  }
})

watch(
  tempLayerConfigWithLayerDetail,
  (config) => {
    if (!config || !mapRef.value) return

    for (const group of config) {
      for (const layerConfig of group.items) {
        let layer = mapRef.value.map
          .getLayers()
          .getArray()
          .find((item) => item.get('id') === layerConfig.layerId)

        if (!layer) {
          if (group.id === LAYER_TYPE.VECTOR) {
            layer = new VectorTile({
              source: new VectorTileSource({
                url: layerConfig.layerDetail?.tiles_url,
              }),
            })
          } else {
            layer = new TileLayer()
            let source

            if (group.id === LAYER_TYPE.WMS) {
              source = new TileWMS({
                url: layerConfig.layerDetail?.wms_url,
                params: {
                  tiled: layerConfig.layerDetail?.use_as_tile_layer,
                },
              })
            } else if (group.id === LAYER_TYPE.XYZ) {
              source = new XYZ({
                url: layerConfig.layerDetail?.tiles_url,
              })
            }

            layer.setSource(source)
          }
          mapRef.value.map.addLayer(layer)
        }

        layer.set('id', layerConfig.layerId)
        layer.setVisible(layerConfig.isActive)
        layer.setOpacity(layerConfig.opacity / 100)
        layer.setZIndex(layerConfig.zIndex)
      }
    }
  },
  { immediate: true },
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
