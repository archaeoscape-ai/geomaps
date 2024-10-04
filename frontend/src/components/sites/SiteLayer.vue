<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { LEFT_PANELS } from '@/helpers/constants'
import { useSiteStore } from '@/stores/SiteStore'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { transform } from 'ol/proj'

const strokeColor = ref('rgba(255, 255, 255, 0.2)')
const fillColor = ref('#3ca23c')
const radius = ref(10)

const leftPanelStore = useLeftPanelStore()
const { activePanel } = storeToRefs(leftPanelStore)

const siteStore = useSiteStore()
const { selectedSite, identifySiteSourceRef, siteMarker, isCreatingSite, sites } =
  storeToRefs(siteStore)

const showIdentifyLayer = computed(() => {
  // return (
  //   activePanel.value !== null &&
  //   (isCreatingSite.value ||
  //     (selectedSite.value !== null &&
  //       (activePanel.value.id === LEFT_PANELS.IDENTIFY ||
  //         activePanel.value.id === LEFT_PANELS.CREATE)))
  // )
  return true
})

const tanfromSiteCoordinate = (coordinates) => {
  return transform(coordinates, 'EPSG:4326', 'EPSG:3857')
}
</script>

<template>
  <ol-vector-layer v-if="showIdentifyLayer">
    <ol-source-vector ref="identifySiteSourceRef">
      <!-- list all sites -->
      <ol-feature v-for="site in sites?.results" :key="site.id">
        <ol-geom-point :coordinates="tanfromSiteCoordinate(site?.location?.coordinates)" />
        <ol-style>
          <ol-style-circle :radius="radius">
            <ol-style-fill :color="fillColor"></ol-style-fill>
            <ol-style-stroke :color="strokeColor" :width="10"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-feature>

      <!-- for edit and create -->
      <ol-feature :properties="selectedSite">
        <ol-geom-point :coordinates="siteMarker" v-if="siteMarker" />
        <ol-style zIndex="1">
          <ol-style-circle :radius="radius">
            <ol-style-fill color="red"></ol-style-fill>
            <ol-style-stroke :color="strokeColor" :width="10"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>
</template>
