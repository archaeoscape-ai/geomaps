import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as siteService from '@/api-services/SiteService'
import { Collection } from 'ol'
import { transform } from 'ol/proj'

export const useSiteStore = defineStore('site', () => {
  /**
   * @type {import('vue').Ref<{ source: import('ol/source/Vector').default } | null>}
   */
  const identifySiteSourceRef = ref(null)
  const newSiteFeatureRef = ref(null)
  const siteSelectInteractionRef = ref(null)
  const selectedSites = ref(new Collection())
  const selectedSite = computed(() => selectedSites.value?.item(0)?.getProperties())

  const isLoading = ref(false)
  const isCreatingSite = ref(false)
  const isEditingSite = ref(false)

  const sites = ref(null)
  const page = ref(0)
  const pageSize = ref(-1)
  const searchText = ref('')
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
      sites.value.results.push(res)
    } else {
      sites.value = { ...sites.value, results: [res] }
    }

    newSiteFeatureRef.value.feature.setProperties(res)
    selectedSites.value.push(newSiteFeatureRef.value.feature)
  }

  async function updateSite(siteId, data) {
    const res = await siteService.updateSite(siteId, data)
    const index = sites.value.results.findIndex((site) => site.id === siteId)
    if (index !== -1) {
      sites.value.results[index] = res
    }
  }

  function setSiteMarker(coordinates) {
    siteMarker.value = coordinates
  }

  async function deleteSite(siteId) {
    await siteService.deleteSite(siteId)
    const index = sites.value.results.findIndex((site) => site.id === siteId)
    if (index !== -1) {
      sites.value.results.splice(index, 1)
    }

    selectedSites.value.clear()
    siteMarker.value = null
  }

  function resetSitePosition() {
    if (selectedSite.value && selectedSite.value.location) {
      const oldCoordinates = transform(
        selectedSite.value?.location.coordinates,
        'EPSG:4326',
        'EPSG:3857',
      )
      selectedSite.value?.geometry?.setCoordinates(oldCoordinates)
    }
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
    siteSelectInteractionRef,
    siteMarker,
    isEditingSite,
    selectedSites,
    newSiteFeatureRef,

    getSites,
    getSiteTypes,
    updateSite,
    createSite,
    setSiteMarker,
    deleteSite,
    resetSitePosition,
  }
})
