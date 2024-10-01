import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { isEqual, cloneDeep } from 'lodash'

export const useMapLayerConfigStore = defineStore('mapLayerConfig', () => {
  const searchText = ref('')

  const expandedLayer = ref(new Map())

  const layerConfig = ref([
    {
      title: 'Vector Layers',
      id: 'vector-layers',
      items: [
        {
          layerId: 101,
          alias: 'Layer 101',
          opacity: 80,
          isActive: true,
          isIdentifiable: false,
        },
        {
          layerId: 102,
          alias: 'Layer 102',
          opacity: 90,
          isActive: false,
          isIdentifiable: false,
        },
        {
          layerId: 103,
          alias: 'Layer 103',
          opacity: 70,
          isActive: true,
          isIdentifiable: false,
        },
        {
          layerId: 104,
          alias: 'Layer 104',
          opacity: 100,
          isActive: false,
          isIdentifiable: false,
        },
      ],
    },
    {
      title: 'WMS Layers',
      id: 'wms-layers',
      items: [
        {
          layerId: 105,
          alias: 'Layer 105',
          opacity: 80,
          isActive: true,
          isIdentifiable: false,
        },
        {
          layerId: 106,
          alias: 'Layer 106',
          opacity: 90,
          isActive: false,
          isIdentifiable: false,
        },
        {
          layerId: 107,
          alias: 'Layer 107',
          opacity: 70,
          isActive: true,
          isIdentifiable: false,
        },
      ],
    },
  ])

  const tempLayerConfig = ref(cloneDeep(layerConfig.value))

  const allLayersToggledOn = computed(() => {
    return tempLayerConfig.value.every((layer) => layer.items.every((item) => item.isActive))
  })

  const allLayersExpanded = computed(() => {
    return tempLayerConfig.value.every((layer) =>
      layer.items.every((item) => !item.isActive || expandedLayer.value.get(item.layerId)),
    )
  })

  const hasLayerConfigChanged = computed(() => !isEqual(layerConfig.value, tempLayerConfig.value))

  /**
   * Retrieves a specific layer object from the configuration by parent layer group ID and layer ID.
   *
   * @param {string} parentId - The ID of the parent layer group (e.g., 'vector-layers').
   * @param {number} layerId - The ID of the specific layer within the parent group.
   * @returns {Object|null} - The layer object if found, or null if not.
   */
  function getLayer(parentId, layerId) {
    const parent = tempLayerConfig.value.find((item) => item.id === parentId)
    if (!parent) return null

    return parent.items.find((item) => item.layerId === layerId)
  }

  /**
   * Sets the 'isActive' state for all items (layers) within a given layer group.
   *
   * @param {Object} layer - The layer group object that contains items.
   * @param {boolean} value - The value to set for 'isActive' on all items (true or false).
   */
  function setLayerItemsActiveState(layer, value) {
    layer.items?.forEach((item) => (item.isActive = value))
  }

  /**
   * Toggles the 'isActive' state for all layers across all layer groups.
   *
   * @param {boolean} value - The value to set for 'isActive' across all layers (true or false).
   */
  function setAllLayersActiveState(value) {
    tempLayerConfig.value.forEach((layer) => setLayerItemsActiveState(layer, value))
  }

  /**
   * Toggles the expanded state for all active layers across all layer groups.
   *
   * @param {boolean} value - The value to set for expanded state (true or false).
   */
  function setAllLayersExpandedState(value) {
    tempLayerConfig.value.forEach((layer) => {
      layer.items.forEach((item) => {
        if (item.isActive) {
          expandedLayer.value.set(item.layerId, value)
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
      updateLayerExpandedState(layerId, value)
    }
  }

  /**
   * Updates the expanded state of a specific active layer.
   *
   * @param {Object} layer - The layer object to update the expanded state.
   * @param {boolean} value - The expanded state to set (true or false).
   */
  function updateLayerExpandedState(layer, value) {
    if (!layer.isActive) return

    expandedLayer.value.set(layer.layerId, value)
  }

  /**
   * Checks if a specific layer is expanded based on its layerId.
   *
   * @param {number} layerId - The ID of the layer to check.
   * @returns {boolean} - True if the layer is expanded, false otherwise.
   */
  function isLayerExpanded(layerId) {
    return expandedLayer.value.get(layerId) || false
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

  watch(
    tempLayerConfig,
    (newValue) => {
      console.log(newValue)
      // update the layer index on the map based on the new position
    },
    { deep: true },
  )

  return {
    searchText,
    layerConfig,
    tempLayerConfig,
    expandedLayer,
    allLayersToggledOn,
    allLayersExpanded,
    hasLayerConfigChanged,

    setLayerItemsActiveState,
    setAllLayersActiveState,
    updateLayerVisibility,
    isLayerExpanded,
    setAllLayersExpandedState,
    updateLayerExpandedState,
    updateLayerOpacity,
  }
})
