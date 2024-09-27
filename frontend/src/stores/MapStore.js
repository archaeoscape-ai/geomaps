import { fetchAllMaps } from '@/api-services/MapService'
import { BASEMAPS } from '@/helpers/constants'
import { fromLonLat } from 'ol/proj'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import _ from 'lodash'

export const useMapStore = defineStore('map', () => {
  /**
   * @type {import('vue').Ref<{ map: import('ol/Map').default } | null>}
   */
  const mapRef = ref(null)

  const basemap = ref(BASEMAPS.OSM)

  const listMaps = ref([])
  const currentMap = ref(null)

  const trackingLocation = ref(false)
  const measuringDistance = ref(false)

  const isLoading = ref(false)

  const center = computed(() => {
    return currentMap.value ? fromLonLat(currentMap.value.center.coordinates) : fromLonLat([0, 0])
  })

  const zoom = computed(() => {
    return currentMap.value?.zoom_level
  })

  async function getListMaps() {
    isLoading.value = true
    const data = await fetchAllMaps()
    listMaps.value = data
    isLoading.value = false
  }

  function setMapById(id) {
    const map = listMaps.value.results.find((m) => m.id === Number.parseInt(id))
    if (map) {
      currentMap.value = map
    }
  }

  function setDefaultMap() {
    if (listMaps.value.count > 0) {
      currentMap.value = _.sortBy(listMaps.value.results, 'id')[0]
    }
  }

  return {
    mapRef,
    basemap,
    listMaps,
    currentMap,
    center,
    zoom,
    trackingLocation,
    measuringDistance,

    getListMaps,
    setMapById,
    setDefaultMap,
  }
})
