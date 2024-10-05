import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as siteService from '@/api-services/SiteService'

export const useSiteStore = defineStore('site', () => {
  /**
   * @type {import('vue').Ref<{ source: import('ol/source/Vector').default } | null>}
   */
  const identifySiteSourceRef = ref(null)

  const isLoading = ref(false)
  const isCreatingSite = ref(false)
  const isEditingSite = ref(false)

  const sites = ref(null)
  const page = ref(0)
  const pageSize = ref(-1)
  const searchText = ref('')
  const selectedSite = ref(null)
  const siteMarker = ref(null)

  const siteTypes = ref(null)

  async function getSiteTypes() {
    const params = {
      limit: -1,
      offset: 0,
    }
    const data = await siteService.getSiteTypes(params)
    siteTypes.value = data
  }

  async function getSites(mapId) {
    if (isLoading.value) return

    try {
      const params = {
        limit: pageSize.value,
        offset: page.value,
        search: searchText.value,
      }
      const data = await siteService.getMapSites(mapId, params)
      sites.value = data
    } catch (err) {
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }

  async function createSite(mapId, data) {
    const res = await siteService.createSite(mapId, data)
    if (sites.value?.results) {
      sites.value.results.push(res);
    } else {
      sites.value = { ...sites.value, results: [res] };
    }
    
    selectedSite.value = res
  }

  async function updateSite(siteId, data) {
    const res = await siteService.updateSite(siteId, data)
    selectedSite.value = res
  }

  function setSiteMarker(coordinates) {
    siteMarker.value = coordinates
  }

  async function deleteSite(siteId) {
    await siteService.deleteSite(siteId)
    selectedSite.value = null
    siteMarker.value = null
  }

  return {
    sites,
    page,
    pageSize,
    searchText,
    selectedSite,
    siteTypes,
    isCreatingSite,
    identifySiteSourceRef,
    siteMarker,
    isEditingSite,

    getSites,
    getSiteTypes,
    updateSite,
    createSite,
    setSiteMarker,
    deleteSite,
  }
})
