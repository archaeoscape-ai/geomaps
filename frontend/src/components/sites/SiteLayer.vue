<script setup>
import { storeToRefs } from 'pinia'
import { inject, ref, watch } from 'vue'
import { useSiteStore } from '@/stores/SiteStore'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import { Circle, Fill, Stroke, Style } from 'ol/style'

const GEOSERVER_BASE_URL = import.meta.env.VITE_GEOSERVER_BASE_URL

const strokeColor = ref('#fafafa')
const fillColor = ref('#16a34a')

const siteStore = useSiteStore()
const {
  selectedSite,
  siteMarker,
  isEditingSite,
  isCreatingSite,
  selectedSiteFeature,
  siteVectorLayerRef,
} = storeToRefs(siteStore)
const { getSiteDetail } = siteStore

const format = inject('ol-format')
const mvtFormat = new format.MVT()

const layerConfigStore = useMapLayerConfigStore()
const { showSiteLayer } = storeToRefs(layerConfigStore)

const greenStyle = new Style({
  image: new Circle({
    radius: 6,
    stroke: new Stroke({
      color: strokeColor.value,
      width: 1,
    }),
    fill: new Fill({
      color: fillColor.value,
    }),
  }),
})

const selectedFeatureStyle = new Style({
  image: new Circle({
    radius: 10,
    stroke: new Stroke({
      color: strokeColor.value,
      width: 1,
    }),
    fill: new Fill({
      color: fillColor.value,
    }),
  }),
})

const redStyle = new Style({
  image: new Circle({
    radius: 6,
    stroke: new Stroke({
      color: strokeColor.value,
      width: 1,
    }),
    fill: new Fill({
      color: '#AB1C28',
    }),
  }),
})

const siteUpdatingStyle = new Style({
  image: new Circle({
    radius: 10,
    stroke: new Stroke({
      color: 'transparent',
      width: 0,
    }),
    fill: new Fill({
      color: 'transparent',
    }),
  }),
})

function styleChanged(feature) {
  if (
    isEditingSite.value &&
    siteMarker.value &&
    feature.getId() === selectedSiteFeature.value.getId()
  ) {
    return siteUpdatingStyle
  }

  if (selectedSiteFeature.value && selectedSiteFeature.value.getId() === feature.getId()) {
    return selectedFeatureStyle
  }

  if (feature.getProperties()['db_resolved'] === '1') {
    return greenStyle
  }

  return redStyle
}

watch(selectedSiteFeature, (feature) => {
  if (siteVectorLayerRef.value) {
    siteVectorLayerRef.value.changed()
  }

  if (feature) {
    getSiteDetail(feature.getId())
  } else {
    selectedSite.value = null
  }
})

// watches the change on siteMarker and isEditingSite,
// if the siteMarker is set and isEditingSite is true, or
// if the siteMarker is unset and isEditingSite is false,
// triggers the change on the vector tile layer to update the style of selected site
watch([siteMarker, isEditingSite], ([marker, isEditing], [oldMarker, prevIsEditing]) => {
  if ((marker && isEditing) || (oldMarker && !isEditing)) {
    siteVectorLayerRef.value.changed()
  }
})
</script>

<template>
  <ol-vector-tile-layer
    name="efeo:efeo_site"
    :zIndex="999"
    renderMode="vector"
    v-if="showSiteLayer"
  >
    <ol-source-vector-tile
      :url="`${GEOSERVER_BASE_URL}/gwc/service/tms/1.0.0/efeo:efeo_site@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf`"
      :format="mvtFormat"
    />
    <ol-style :overrideStyleFunction="styleChanged" />
  </ol-vector-tile-layer>

  <ol-vector-layer v-if="isEditingSite || isCreatingSite">
    <ol-source-vector>
      <ol-feature v-if="siteMarker">
        <ol-geom-point :coordinates="siteMarker" />
        <ol-style zIndex="1">
          <ol-style-circle :radius="10">
            <ol-style-stroke :strokeWidth="1" :color="strokeColor"></ol-style-stroke>
            <ol-style-fill :color="fillColor"></ol-style-fill>
          </ol-style-circle>
        </ol-style>
      </ol-feature>
    </ol-source-vector>
  </ol-vector-layer>
</template>
