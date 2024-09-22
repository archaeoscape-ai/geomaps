<script setup>
import { fromLonLat } from 'ol/proj'
import { ref } from 'vue'
import MapControls from './MapControls.vue'
import { useMapStore } from '@/stores/MapStore';
import { storeToRefs } from 'pinia';
import NoteLayer from '@/components/notes/NoteLayer.vue';

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore();
const { map } = storeToRefs(mapStore) 

const center = ref(fromLonLat([-68.3468, -23.1304]))
const projection = ref('EPSG:3857')
const zoom = ref(3)
const rotation = ref(0)
</script>

<template>
  <div class="absolute inset-0">
    <ol-map class="h-full" :controls="[]" ref="map">
      <ol-view
        ref="view"
        :center="center"
        :rotation="rotation"
        :zoom="zoom"
        :projection="projection"
      />
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <NoteLayer />
    </ol-map>

    <MapControls :is-panel-active="isPanelActive" :map="map" />
  </div>
</template>

<style>
.ol-attribution {
  display: none;
}
</style>
