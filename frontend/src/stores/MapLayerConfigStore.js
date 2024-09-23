import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useMapLayerConfigStore = defineStore('mapLayerConfig', () => {
  const expandedMap = ref(new Map())

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

  const allLayersToggledOn = computed(() => {
    return layerConfig.value.every((layer) => layer.items.every((item) => item.isActive))
  })

  const allLayersExpanded = computed(() => {
    return layerConfig.value.every((layer) =>
      layer.items.every((item) => !item.isActive || expandedMap.value.get(item.layerId)),
    )
  })

  function getLayer(parentId, layerId) {
    const parent = layerConfig.value.find((item) => item.id === parentId)
    if (!parent) return null

    return parent.items.find((item) => item.layerId === layerId)
  }

  function setLayerItemsActiveState(layer, value) {
    layer.items?.forEach((item) => (item.isActive = value))
  }

  function setAllLayersActiveState(value) {
    layerConfig.value.forEach((layer) => setLayerItemsActiveState(layer, value))
  }

  function setAllLayersExpandedState(value) {
    layerConfig.value.forEach((layer) => {
      layer.items.forEach((item) => {
        if (item.isActive) {
          expandedMap.value.set(item.layerId, value)
        }
      })
    })
  }

  function updateLayerVisibility(parentId, layerId, value) {
    const layer = getLayer(parentId, layerId)
    if (!layer) return

    layer.isActive = value
    if (!value) {
      updateLayerExpandedState(layerId, value)
    }
  }

  function updateLayerExpandedState(layer, value) {
    if (!layer.isActive) return

    expandedMap.value.set(layer.layerId, value)
  }

  function isLayerExpanded(layerId) {
    return expandedMap.value.get(layerId) || false
  }

  function updateLayerOpacity(parentId, layerId, value) {
    const layer = getLayer(parentId, layerId)
    if (!layer || !layer.isActive) return

    layer.opacity = value
  }

  watch(
    layerConfig,
    (newValue) => {
      console.log(newValue)
      // update the layer index on the map based on the new position
    },
    { deep: true },
  )

  return {
    layerConfig,
    expandedMap,
    allLayersToggledOn,
    allLayersExpanded,

    setLayerItemsActiveState,
    setAllLayersActiveState,
    updateLayerVisibility,
    isLayerExpanded,
    setAllLayersExpandedState,
    updateLayerExpandedState,
    updateLayerOpacity,
  }
})
