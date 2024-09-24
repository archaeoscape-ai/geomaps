import { BASEMAPS } from '@/helpers/constants'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  /**
   * @type {import('vue').Ref<{ map: import('ol/Map').default } | null>}
   */
  const map = ref(null)

  const basemap = ref(BASEMAPS.OSM)

  return {
    map,
    basemap,
  }
})
