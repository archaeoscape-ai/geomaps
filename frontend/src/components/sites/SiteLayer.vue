<script setup>
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { LEFT_PANELS } from '@/helpers/constants'
import { useSiteStore } from '@/stores/SiteStore'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import SiteFeature from '@/components/sites/SiteFeature.vue'

const strokeColor = ref('rgba(255, 255, 255, 0.2)')
const fillColor = ref('#3ca23c')

const leftPanelStore = useLeftPanelStore()
const { setTab } = leftPanelStore

const siteStore = useSiteStore()
const {
  selectedSiteFeature,
  identifySiteSourceRef,
  siteMarker,
  isCreatingSite,
  sites,
  isEditingSite,
  selectSiteInteractionRef,
  newSiteFeatureRef,
} = storeToRefs(siteStore)

function onFeatureSelected(event) {
  const deselectedFeatures = event.deselected

  if (deselectedFeatures.length > 0) {
    selectedSiteFeature.value = null
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

function removeCondition(event) {
  return isEditingSite.value
}
</script>

<template>
  <ol-vector-layer zIndex="1000">
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
        ref="selectSiteInteractionRef"
        :removeCondition="removeCondition"
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
