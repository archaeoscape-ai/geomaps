import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  /**
   * @type {import('vue').Ref<{ map: import('ol/Map').default } | null>}
   */
  const map = ref(null)

  function setMap(m) {
    map.value = m
  }

  return {
    map,

    setMap,
  }
})
