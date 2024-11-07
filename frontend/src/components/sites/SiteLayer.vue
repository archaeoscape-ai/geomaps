<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { LEFT_PANELS } from '@/helpers/constants'
import { useSiteStore } from '@/stores/SiteStore'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import SiteFeature from '@/components/sites/SiteFeature.vue'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'

const strokeColor = ref('#fafafa')
const fillColor = ref('#16a34a')
const fillColorSelected = ref('#166534')

const leftPanelStore = useLeftPanelStore()
const { setTab } = leftPanelStore

const siteStore = useSiteStore()
const {
  selectedSite,
  sitesGeom,
  siteMarker,
  isEditingSite,
  isCreatingSite,
  selectedSiteFeature,
  newSiteFeatureRef,
  selectSiteInteractionRef,
} = storeToRefs(siteStore)
const { getSiteDetail } = siteStore

const layerConfigStore = useMapLayerConfigStore()
const { showSiteLayer } = storeToRefs(layerConfigStore)

function onFeatureSelected(event) {
  const deselectedFeatures = event.deselected

  if (deselectedFeatures.length > 0) {
    if (!isCreatingSite.value) {
      selectedSiteFeature.value = null
      setTab(LEFT_PANELS.LIST)
    }
  }

  const features = event.selected
  if (features.length === 0) {
    return
  }

  selectedSiteFeature.value = features[0]
  setTab(LEFT_PANELS.IDENTIFY)
}

const selectInteactionFilter = (feature) => {
  return !isCreatingSite.value && !isEditingSite.value && feature.getProperties().type === 'site'
}

function removeCondition() {
  return isEditingSite.value
}

watch(selectedSiteFeature, (feature) => {
  if (feature) {
    getSiteDetail(feature.getProperties().id)
  } else {
    selectedSite.value = null
  }
})
</script>

<template>
  <ol-vector-layer zIndex="1000" v-if="showSiteLayer" name="siteVectorLayer">
    <ol-source-vector>
      <!-- list all sites -->
      <SiteFeature
        v-for="site in sitesGeom"
        :site="site"
        :key="site.id"
        :fillColor="fillColor"
        :strokeColor="strokeColor"
        :radius="8"
      />

      <!-- for create -->
      <ol-feature v-if="siteMarker && isCreatingSite" ref="newSiteFeatureRef">
        <ol-geom-point :coordinates="siteMarker" />
        <ol-style zIndex="1">
          <ol-style-circle :radius="8">
            <ol-style-stroke :strokeWidth="1" color="strokeColor"></ol-style-stroke>
            <ol-style-fill :color="fillColor"></ol-style-fill>
          </ol-style-circle>
        </ol-style>
      </ol-feature>

      <ol-interaction-select
        @select="onFeatureSelected"
        :filter="selectInteactionFilter"
        ref="selectSiteInteractionRef"
        :removeCondition="removeCondition"
      >
        <ol-style zIndex="1">
          <ol-style-circle :radius="12">
            <ol-style-stroke :strokeWidth="1" :color="strokeColor"></ol-style-stroke>
            <ol-style-fill :color="fillColorSelected"></ol-style-fill>
          </ol-style-circle>
        </ol-style>
      </ol-interaction-select>
    </ol-source-vector>
  </ol-vector-layer>
</template>
