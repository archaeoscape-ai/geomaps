import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as siteService from '@/api-services/SiteService'

export const useSiteStore = defineStore('site', () => {
  const isLoading = ref(false)

  const sites = ref(null)
  const page = ref(0)
  const pageSize = ref(10)
  const searchText = ref('')
  const selectedSite = ref(null)

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

  function setSelectedSite(site) {
    selectedSite.value = site
  }

  return {
    sites,
    page,
    pageSize,
    searchText,
    selectedSite,

    getSites,
    setSelectedSite,
  }
})
