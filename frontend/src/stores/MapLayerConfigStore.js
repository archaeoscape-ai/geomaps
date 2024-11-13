import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { cloneDeep, isEqual, reverse } from 'lodash'
import {
  fetchMapById,
  fetchMapLayerConfig,
  updateCurrentMapLayerConfig,
} from '@/api-services/MapService'
import { LAYER_TYPE, LAYER_TYPE_LABEL } from '@/helpers/constants'
import { zoomByDelta } from 'ol/interaction/Interaction'
import { WMSCapabilities } from 'ol/format'

export const useMapLayerConfigStore = defineStore('mapLayerConfig', () => {
  const searchText = ref('')
  const expandedLayer = ref(new Map())

  const mapDetail = ref(null)
  const layerConfig = ref([])
  const tempLayerConfig = ref([])
  const isLoading = ref(false)
  const showSiteLayer = ref(true)
  const wmsCapabilities = ref(null)

  const currentLayers = computed(() => {
    if (!mapDetail.value) return []
    const res = {}

    for (const layerType of Object.values(LAYER_TYPE)) {
      res[layerType] = [...mapDetail.value[layerType].map((l) => l.id)]
    }

    return res
  })

  const mapDetailDict = computed(() => {
    if (!mapDetail.value) return []
    const res = {}

    for (const layerType of Object.values(LAYER_TYPE)) {
      res[layerType] = mapDetail.value[layerType].reduce((prev, curr) => {
        return { ...prev, [curr.id]: { ...curr } }
      }, {})
    }

    return res
  })

  const tempLayerConfigWithLayerDetail = computed(() => {
    if (!mapDetail.value) return []

    let zIndex = tempLayerConfig.value.reduce((prev, curr) => prev + curr.items.length, 1)

    return tempLayerConfig.value.map((group) => {
      const items = group.items.map((layer) => {
        zIndex--
        return {
          ...layer,
          zIndex: zIndex,
          layerDetail: mapDetailDict.value[group.id][layer.layerId],
        }
      })
      return { ...group, items }
    })
  })

  const allLayersToggledOn = computed(() => {
    return tempLayerConfig.value.every((layer) => layer.items.every((item) => item.isActive))
  })

  const allLayersExpanded = computed(() => {
    return tempLayerConfig.value.every((group) =>
      group.items.every(
        (item) => !item.isActive || expandedLayer.value.get(getKey(group.id, item.layerId)),
      ),
    )
  })

  const hasLayerConfigChanged = computed(() => !isEqual(layerConfig.value, tempLayerConfig.value))

  /**
   * Initialize empty map config from map detail
   */
  function initializeTempLayerConfig() {
    for (const layerType of Object.values(LAYER_TYPE)) {
      tempLayerConfig.value.push({
        id: layerType,
        title: LAYER_TYPE_LABEL[layerType],
        items: [
          ...mapDetail.value[layerType].map((l) => ({
            layerId: l.id,
            alias: l.alias,
            isActive: true,
            opacity: 100,
          })),
        ],
      })
    }
  }

  async function getMapLayerConfig(id) {
    isLoading.value = true
    const data = await fetchMapLayerConfig(id)
    if (data.config) {
      layerConfig.value = data.config
      tempLayerConfig.value = cloneDeep(layerConfig.value)
    }

    isLoading.value = false
  }

  async function getMapDetail(id) {
    isLoading.value = true
    const data = await fetchMapById(id)
    mapDetail.value = data
    isLoading.value = false
  }

  async function getWMSCapabilities() {
    const parser = new WMSCapabilities()
    const url = new URL('geoserver/efeo/wms', import.meta.env.VITE_BASE_API_URL)
    url.searchParams.set('REQUEST', 'GetCapabilities')

    const response = await fetch(url.toString())
    const data = await response.text()
    const result = parser.read(data)
    wmsCapabilities.value = result
  }

  /**
   * Initialize map config and sync if the map config is stale
   * @param {number} id map id
   */
  async function initializeMapConfig(id) {
    const p1 = getMapLayerConfig(id)
    const p2 = getMapDetail(id)
    const p3 = getWMSCapabilities()
    await Promise.all([p1, p2, p3])
    syncLayerConfig()
  }

  /**
   * Update map config
   * @param {number} id map id
   */
  async function updateLayerConfig(id) {
    isLoading.value = true
    const data = await updateCurrentMapLayerConfig(id, tempLayerConfig.value)
    if (data.config) {
      layerConfig.value = data.config
      tempLayerConfig.value = cloneDeep(layerConfig.value)
    }
    isLoading.value = false
  }

  /**
   * Sync layer config with list of layers returned on the map
   * in case there are additions or deletions of layers on admin panel
   */
  function syncLayerConfig() {
    // console.log(layerConfig.value, mapDetail.value, tempLayerConfig.value)
    if (tempLayerConfig.value.length === 0) {
      initializeTempLayerConfig()
    } else {
      // Delete extra layer in temp config
      for (const layerGroup of tempLayerConfig.value) {
        const type = layerGroup.id
        const items = layerGroup.items
        const idsToRemove = []

        for (let i = 0; i < items.length; i++) {
          if (!currentLayers.value[type].includes(items[i].layerId)) {
            idsToRemove.push(i)
          }
        }

        reverse(idsToRemove).forEach((i) => {
          items.splice(i, 1)
        })
      }

      // Add new layers to config
      for (const layerGroup of tempLayerConfig.value) {
        const type = layerGroup.id
        const items = layerGroup.items
        const idsInTempLayerConfig = items.map((layer) => layer.layerId)

        for (const id of currentLayers.value[type]) {
          if (!idsInTempLayerConfig.includes(id)) {
            const layer = mapDetail.value[type].find((layer) => layer.id === id)
            items.push({
              layerId: layer.id,
              alias: layer.alias,
              isActive: false,
              opacity: 100,
            })
          }
        }
      }
    }
  }

  /**
   * Retrieves a specific layer object from the configuration by parent layer group ID and layer ID.
   *
   * @param {string} parentId - The ID of the parent layer group (e.g., 'vector-layers').
   * @param {number} layerId - The ID of the specific layer within the parent group.
   * @returns {Object|null} - The layer object if found, or null if not.
   */
  function getLayer(parentId, layerId) {
    const parent = tempLayerConfig.value.find((group) => group.id === parentId)
    if (!parent) return null

    return parent.items.find((layer) => layer.layerId === layerId)
  }

  /**
   * Sets the 'isActive' state for all items (layers) within a given layer group.
   *
   * @param {Object} layer - The layer group object that contains items.
   * @param {boolean} value - The value to set for 'isActive' on all items (true or false).
   */
  function setLayerItemsActiveState(group, value) {
    // const groupConfig = tempLayerConfig.value.find((g) => g.id === group.id)
    // console.log(groupConfig)
    // group.items.forEach((item) => (item.isActive = value))
    tempLayerConfig.value = tempLayerConfig.value.map((g) => {
      if (g.id !== group.id) {
        return g
      }
      const items = g.items.map((layer) => ({ ...layer, isActive: value }))
      return { ...g, items }
    })
  }

  /**
   * Toggles the 'isActive' state for all layers across all layer groups.
   *
   * @param {boolean} value - The value to set for 'isActive' across all layers (true or false).
   */
  function setAllLayersActiveState(value) {
    showSiteLayer.value = value
    tempLayerConfig.value = tempLayerConfig.value.map((g) => {
      const items = g.items.map((layer) => ({ ...layer, isActive: value }))
      return { ...g, items }
    })
  }

  /**
   * Toggles the expanded state for all active layers across all layer groups.
   *
   * @param {boolean} value - The value to set for expanded state (true or false).
   */
  function setAllLayersExpandedState(value) {
    tempLayerConfig.value.forEach((group) => {
      group.items.forEach((layer) => {
        if (layer.isActive) {
          expandedLayer.value.set(getKey(group.id, layer.layerId), value)
        }
      })
    })
  }

  /**
   * Updates the visibility (isActive) state of a specific layer. If visibility is turned off, also collapses the layer.
   *
   * @param {string} parentId - The ID of the parent layer group (e.g., 'wms-layers').
   * @param {number} layerId - The ID of the specific layer within the parent group.
   * @param {boolean} value - The visibility state to set for the layer (true for visible, false for hidden).
   */
  function updateLayerVisibility(parentId, layerId, value) {
    const layer = getLayer(parentId, layerId)
    if (!layer) return

    layer.isActive = value
    if (!value) {
      updateLayerExpandedState(parentId, layerId, value)
    }
  }

  /**
   * Updates the expanded state of a specific active layer.
   *
   * @param {string} parentId - The ID of the parent layer group (e.g., 'wms-layers').
   * @param {Object} layer - The layer object to update the expanded state.
   * @param {boolean} value - The expanded state to set (true or false).
   */
  function updateLayerExpandedState(parentId, layer, value) {
    if (!layer.isActive) return

    expandedLayer.value.set(getKey(parentId, layer.layerId), value)
  }

  /**
   * Checks if a specific layer is expanded based on its layerId.
   *
   * @param {string} parentId - The ID of the parent layer group (e.g., 'wms-layers').
   * @param {number} layerId - The ID of the layer to check.
   * @returns {boolean} - True if the layer is expanded, false otherwise.
   */
  function isLayerExpanded(parentId, layerId) {
    return expandedLayer.value.get(getKey(parentId, layerId)) || false
  }

  /**
   * Updates the opacity of a specific active layer.
   *
   * @param {string} parentId - The ID of the parent layer group.
   * @param {number} layerId - The ID of the specific layer.
   * @param {number} value - The new opacity value (0-100).
   */
  function updateLayerOpacity(parentId, layerId, value) {
    const layer = getLayer(parentId, layerId)
    if (!layer || !layer.isActive) return

    layer.opacity = value
  }

  function getKey(parentId, layerId) {
    return `${parentId}-${layerId}`
  }

  return {
    showSiteLayer,
    searchText,
    layerConfig,
    tempLayerConfig,
    tempLayerConfigWithLayerDetail,
    currentLayers,
    expandedLayer,
    allLayersToggledOn,
    allLayersExpanded,
    hasLayerConfigChanged,
    mapDetail,
    wmsCapabilities,

    getMapLayerConfig,
    getMapDetail,
    updateLayerConfig,
    initializeMapConfig,
    syncLayerConfig,
    setLayerItemsActiveState,
    setAllLayersActiveState,
    updateLayerVisibility,
    isLayerExpanded,
    setAllLayersExpandedState,
    updateLayerExpandedState,
    updateLayerOpacity,
    initializeTempLayerConfig,
  }
})
