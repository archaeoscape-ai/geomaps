<script setup>
import { ref } from 'vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Label from '@/components/ui/label/Label.vue'
import Slider from '@/components/ui/slider/Slider.vue'
import { GripVertical, ChevronDown, ChevronUp, Scan, List } from 'lucide-vue-next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import { WMSCapabilities } from 'ol/format'
import { Projection, transform } from 'ol/proj'
import { fromEPSGCode } from 'ol/proj/proj4'

const mapStore = useMapStore()
const { mapRef } = storeToRefs(mapStore)

const layerConfigStore = useMapLayerConfigStore()

const props = defineProps({
  parentId: { type: String, required: true },
  item: { type: Object, required: true },
})

const showLegend = ref(false)

function toggleShowLegend() {
  showLegend.value = !showLegend.value
}

async function zoomToExtent() {
  const transformProjection = async ([minX, minY, maxX, maxY]) => {
    const source = await fromEPSGCode('EPSG:32648')
    const dest = new Projection({ code: 'EPSG:3857' })
    const bottomLeft = transform([minX, minY], source, dest)
    const topRight = transform([maxX, maxY], source, dest)

    return [...bottomLeft, ...topRight]
  }

  const wmsCapabilities = new WMSCapabilities()
  const url = new URL('geoserver/efeo/wms', import.meta.env.VITE_BASE_API_URL)
  url.searchParams.set('REQUEST', 'GetCapabilities')

  const response = await fetch(url.toString())
  const data = await response.text()
  const result = wmsCapabilities.read(data)
  const layer = result.Capability?.Layer?.Layer?.find((layer) => layer.Name === props.item.alias)
  const extent = layer?.BoundingBox?.find((bb) => bb.crs === 'EPSG:32648')?.extent

  const transformedExtent = await transformProjection(extent)

  if (extent) {
    mapRef.value.map.getView().fit(transformedExtent)
  }
}
</script>

<template>
  <Card class="mt-4">
    <CardHeader class="flex flex-row justify-between p-2">
      <div class="flex flex-grow items-center justify-start gap-2 overflow-hidden">
        <GripVertical class="drag-handle flex-shrink-0 cursor-pointer stroke-button-icon" />
        <Switch
          :id="`${parentId}-${item.layerId}`"
          :checked="item.isActive"
          @update:checked="
            (value) => layerConfigStore.updateLayerVisibility(parentId, item.layerId, value)
          "
          class="flex-shrink-0"
        />
        <Label
          class="cursor-pointer overflow-hidden truncate font-semibold"
          :for="`${parentId}-${item.layerId}`"
        >
          {{ item.alias }}
        </Label>
      </div>

      <ChevronDown
        class="flex-shrink-0 cursor-pointer stroke-button-icon"
        @click="layerConfigStore.updateLayerExpandedState(parentId, item, true)"
        v-if="!layerConfigStore.isLayerExpanded(parentId, item.layerId)"
      />
      <ChevronUp
        class="flex-shrink-0 cursor-pointer stroke-button-icon"
        @click="layerConfigStore.updateLayerExpandedState(parentId, item, false)"
        v-else
      />
    </CardHeader>

    <CardContent
      class="mb-2 flex flex-col p-2"
      v-if="item.isActive && layerConfigStore.isLayerExpanded(parentId, item.layerId)"
    >
      <div class="flex w-full flex-col gap-4 px-1">
        <div class="flex items-center gap-4">
          <span class="cursor-pointer" @click="zoomToExtent">
            <Scan size="20" class="stroke-button-icon" />
          </span>
          <span class="cursor-pointer" @click="toggleShowLegend">
            <List class="stroke-button-icon" />
          </span>
        </div>
        <div>
          <Slider
            :default-value="[item.opacity]"
            :max="100"
            :step="1"
            :disabled="!item.isActive"
            @update:modelValue="
              (value) => layerConfigStore.updateLayerOpacity(parentId, item.layerId, value[0])
            "
          />
        </div>
      </div>
      <div class="mt-2" v-if="item.isActive && showLegend">
        <span class="divider"></span>
        <h1>show legend</h1>
      </div>
    </CardContent>
  </Card>
</template>
