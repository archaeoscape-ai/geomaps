<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { LEFT_PANELS } from '@/helpers/constants'
import { useSiteStore } from '@/stores/SiteStore'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { transform } from 'ol/proj'
import SiteFeature from '@/components/sites/SiteFeature.vue'

const strokeColor = ref('rgba(255, 255, 255, 0.2)')
const fillColor = ref('#3ca23c')
const radius = ref(10)

const leftPanelStore = useLeftPanelStore()
const { activePanel } = storeToRefs(leftPanelStore)

const siteStore = useSiteStore()
const {
  selectedSite,
  identifySiteSourceRef,
  siteMarker,
  isCreatingSite,
  sites,
  isEditingSite,
  siteSelectInteractionRef,
  selectedSites,
  newSiteFeatureRef,
} = storeToRefs(siteStore)

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

const transfromSiteCoordinate = (coordinates) => {
  return transform(coordinates, 'EPSG:4326', 'EPSG:3857')
}

function onFeatureSelected(event) {
  const deselectedFeatures = event.deselected

  if (deselectedFeatures.length > 0) {
    if (isEditingSite.value) {
      selectedSites.value.push(deselectedFeatures[0])
      return
    }
  }

  const features = event.selected
  if (features.length === 0) {
    return
  }

  selectedSites.value.clear()
  selectedSites.value.push(features[0])
  leftPanelStore.setTab(LEFT_PANELS.IDENTIFY)
}

const selectInteactionFilter = (feature) => {
  return !isCreatingSite.value && !isEditingSite.value && feature.getProperties().type === 'site'
}
</script>

<template>
  <ol-vector-layer v-if="showIdentifyLayer">
    <ol-source-vector ref="identifySiteSourceRef">
      <!-- list all sites -->
      <SiteFeature v-for="site in sites?.results" :site="site" :key="site.id" />

      <!-- for create -->
      <ol-feature v-if="siteMarker && isCreatingSite" ref="newSiteFeatureRef">
        <ol-geom-point :coordinates="siteMarker" />
        <ol-style zIndex="1">
          <ol-style-circle :radius="16">
            <ol-style-fill :color="fillColor"></ol-style-fill>
            <ol-style-stroke :color="strokeColor" :width="16"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-feature>

      <ol-interaction-select
        @select="onFeatureSelected"
        :filter="selectInteactionFilter"
        ref="siteSelectInteractionRef"
        :features="selectedSites"
      >
        <ol-style zIndex="1">
          <ol-style-circle :radius="16">
            <ol-style-fill :color="fillColor"></ol-style-fill>
            <ol-style-stroke :color="strokeColor" :width="16"></ol-style-stroke>
          </ol-style-circle>
        </ol-style>
      </ol-interaction-select>
    </ol-source-vector>
  </ol-vector-layer>
</template>
