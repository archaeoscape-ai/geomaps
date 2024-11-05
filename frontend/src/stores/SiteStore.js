import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import * as siteService from '@/api-services/SiteService'
import { transform } from 'ol/proj'
import { useLeftPanelStore } from './LeftPanelStore'
import { LEFT_PANELS } from '@/helpers/constants'
import { useMapStore } from './MapStore'

export const useSiteStore = defineStore('site', () => {
  /**
   * @type {import('vue').Ref<{ source: import('ol/source/Vector').default } | null>}
   */
  // const siteLayerSourceRef = ref(null)
  const newSiteFeatureRef = ref(null)
  const selectSiteInteractionRef = ref(null)
  const selectedSiteFeature = ref(null)
  const selectedSite = computed(() => selectedSiteFeature.value?.getProperties())

  const isLoading = ref(false)
  const isCreatingSite = ref(false)
  const isEditingSite = ref(false)
  const isShowingFilter = ref(false)

  const sites = ref(null)
  const page = ref(0)
  const pageSize = ref(-1)
  const searchText = ref('')
  const siteMarker = ref(null)
  const siteFilters = ref({
    english_name: '',
    french_name: '',
    khmer_name: '',
    alternative_name: '',
    alternative_khmer_name: '',
    description: '',
    ik_id_starred: false,
    created_on: '',
    updated_on: '',
    created_by: '',
  })

  const siteTypes = ref(null)

  const mapStore = useMapStore()
  const { mapRef } = storeToRefs(mapStore)

  const leftPanelStore = useLeftPanelStore()

  const showIdentifyLayer = ref(true)

  const siteLayerSourceRef = computed(() => {
    const siteVectorLayer = mapRef.value.map
      .getLayers()
      .getArray()
      .find((item) => item.get('name') === 'siteVectorLayer')

    return siteVectorLayer.getSource()
  })

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

    console.log(siteFilters.value)

    try {
      const params = {
        limit: pageSize.value,
        offset: page.value,
        search: searchText.value,
        ...siteFilters.value,
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

    return res
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

    selectedSiteFeature.value = null
    leftPanelStore.setTab(LEFT_PANELS.LIST)
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

  function centerSelectedSite() {
    if (!selectedSiteFeature.value) return

    const geometry = selectedSiteFeature.value.getGeometry()
    const center = geometry.getExtent()

    mapRef.value.map.getView().animate({
      center: center,
      duration: 1000,
    })
  }

  return {
    sites,
    page,
    pageSize,
    searchText,
    siteFilters,
    selectedSiteFeature,
    selectedSite,
    siteTypes,
    isCreatingSite,
    siteLayerSourceRef,
    selectSiteInteractionRef,
    siteMarker,
    isEditingSite,
    isShowingFilter,
    newSiteFeatureRef,
    showIdentifyLayer,

    getSites,
    getSiteTypes,
    updateSite,
    createSite,
    setSiteMarker,
    deleteSite,
    resetSitePosition,
    centerSelectedSite,
  }
})
