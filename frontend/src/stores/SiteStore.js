import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import * as siteService from '@/api-services/SiteService'
import { fromLonLat, transform } from 'ol/proj'
import { useLeftPanelStore } from './LeftPanelStore'
import { LEFT_PANELS } from '@/helpers/constants'
import { useMapStore } from './MapStore'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Point } from 'ol/geom'
import { Feature } from 'ol'

export const useSiteStore = defineStore('site', () => {
  const end = today(getLocalTimeZone())
  const start = end.subtract({ days: 7 })

  const selectedSiteFeature = ref(null)
  const selectedSite = ref(null)

  const isLoading = ref(false)
  const isCreatingSite = ref(false)
  const isEditingSite = ref(false)
  const isShowingFilter = ref(false)
  const showIdentifyLayer = ref(true)

  const sites = ref(null)
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
  const { currentMap, mapRef } = storeToRefs(mapStore)

  const leftPanelStore = useLeftPanelStore()

  const siteVectorLayerRef = computed(() => {
    return mapRef.value.map
      .getLayers()
      .getArray()
      .find((item) => item.get('name') === 'efeo:efeo_site')
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

    await getSites(mapId)

    return res
  }

  async function updateSite(siteId, data) {
    const res = await siteService.updateSite(siteId, data)
    let index = sites.value.results.findIndex((site) => site.id === siteId)
    if (index !== -1) {
      sites.value.results[index] = res
    }

    return res
  }

  function setSiteMarker(coordinates) {
    siteMarker.value = coordinates
  }

  async function deleteSite(siteId) {
    await siteService.deleteSite(siteId)

    await getSites(currentMap.value.id)
    selectedSiteFeature.value = null
    leftPanelStore.setTab(LEFT_PANELS.LIST)
    refreshSiteVectorLayer()
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

  function createFeatureFromSite(site) {
    const point = new Point(fromLonLat(site.location.coordinates))
    const extent = point.getExtent()
    const feature = new Feature({
      geometry: point,
      extent: extent,
    })
    feature.setId(site.id)
    feature.setProperties(site)

    return feature
  }

  const refreshSiteVectorLayer = () => {
    const source = siteVectorLayerRef.value?.getSource()
    if (source) {
      source.refresh()
    }
  }

  return {
    isLoading,
    sites,
    page,
    pageSize,
    searchText,
    siteFilters,
    selectedSiteFeature,
    selectedSite,
    siteTypes,
    isCreatingSite,
    siteMarker,
    isEditingSite,
    isShowingFilter,
    showIdentifyLayer,
    siteVectorLayerRef,

    getSites,
    getSiteTypes,
    getSiteDetail,
    updateSite,
    createSite,
    setSiteMarker,
    deleteSite,
    resetSitePosition,
    createFeatureFromSite,
    refreshSiteVectorLayer,
  }
})
