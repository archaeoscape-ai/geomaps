import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import * as siteService from '@/api-services/SiteService'
import { transform } from 'ol/proj'
import { useLeftPanelStore } from './LeftPanelStore'
import { LEFT_PANELS } from '@/helpers/constants'
import { useMapStore } from './MapStore'
import { getLocalTimeZone, today } from '@internationalized/date'

export const useSiteStore = defineStore('site', () => {
  const end = today(getLocalTimeZone())
  const start = end.subtract({ days: 7 })

  /**
   * @type {import('vue').Ref<{ source: import('ol/source/Vector').default } | null>}
   */
  // const siteLayerSourceRef = ref(null)
  const newSiteFeatureRef = ref(null)
  const selectSiteInteractionRef = ref(null)
  const selectedSiteFeature = ref(null)
  const selectedSite = ref(null)

  const isLoading = ref(false)
  const isCreatingSite = ref(false)
  const isEditingSite = ref(false)
  const isShowingFilter = ref(false)

  const sites = ref(null)
  const sitesGeom = ref(null)
  const page = ref(0)
  const pageSize = ref(20)
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
    created_on_gte: '',
    created_on_lte: '',
    updated_on_gte: '',
    updated_on_lte: '',
    created_by: '',
  })

  const siteTypes = ref(null)

  const mapStore = useMapStore()
  const { mapRef, currentMap } = storeToRefs(mapStore)

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
    isLoading.value = true
    const filters = getCleanFilters(siteFilters.value)

    try {
      const params = {
        limit: pageSize.value,
        offset: (page.value - 1) * pageSize.value,
        search: searchText.value,
        ...filters,
      }
      const data = await siteService.getMapSites(mapId, params)
      sites.value = data
    } catch (err) {
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }

  async function getSitesGeom(mapId) {
    isLoading.value = true

    const filters = getCleanFilters(siteFilters.value)

    try {
      const params = {
        search: searchText.value,
        ...filters,
      }
      const data = await siteService.getMapSitesGeom(mapId, params)
      sitesGeom.value = data
    } catch (err) {
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }

  async function getSiteDetail(siteId) {
    try {
      isLoading.value = true
      const res = await siteService.siteDetail(siteId)
      selectedSite.value = res
    } finally {
      isLoading.value = false
    }
  }

  async function createSite(mapId, data) {
    const res = await siteService.createSite(mapId, data)

    sitesGeom.value.push({
      id: res.id,
      location: res.location,
      db_resolved: res.db_resolved,
    })

    await getSites(mapId)

    return res
  }

  async function updateSite(siteId, data) {
    const res = await siteService.updateSite(siteId, data)
    let index = sites.value.results.findIndex((site) => site.id === siteId)
    if (index !== -1) {
      sites.value.results[index] = res
    }

    index = sitesGeom.value.findIndex((site) => site.id === siteId)
    if (index !== -1) {
      sitesGeom.value[index] = {
        id: res.id,
        location: res.location,
        db_resolved: res.db_resolved,
      }
    }
  }

  function setSiteMarker(coordinates) {
    siteMarker.value = coordinates
  }

  async function deleteSite(siteId) {
    await siteService.deleteSite(siteId)
    const index = sitesGeom.value.findIndex((site) => site.id === siteId)
    if (index !== -1) {
      sitesGeom.value.splice(index, 1)
    }
    await getSites(currentMap.value.id)

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

  function getCleanFilters() {
    let filters = Object.keys(siteFilters.value)
      .filter((k) => siteFilters.value[k])
      .reduce((a, k) => ({ ...a, [k]: siteFilters.value[k] }), {})

    const fields = ['created_on', 'updated_on']

    for (const field of fields) {
      const lte = `${field}_lte`
      const gte = `${field}_gte`
      if (lte in filters && gte in filters && filters[lte] === filters[gte]) {
        filters[field] = filters[gte]
        delete filters[gte]
        delete filters[lte]
      }
    }

    return filters
  }

  return {
    isLoading,
    sites,
    sitesGeom,
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
    getSitesGeom,
    getSiteTypes,
    getSiteDetail,
    updateSite,
    createSite,
    setSiteMarker,
    deleteSite,
    resetSitePosition,
    centerSelectedSite,
  }
})
