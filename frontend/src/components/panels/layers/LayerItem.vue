<script setup>
import { computed, ref } from 'vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Label from '@/components/ui/label/Label.vue'
import Slider from '@/components/ui/slider/Slider.vue'
import { GripVertical, ChevronDown, ChevronUp, Scan, Info, List } from 'lucide-vue-next'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'

const layerConfigStore = useMapLayerConfigStore()

const props = defineProps({
  parentId: { type: String, required: true },
  item: { type: Object, required: true },
})

const showLegend = ref(false)

function toggleShowLegend() {
  showLegend.value = !showLegend.value
}
</script>

<template>
  <Card class="mt-4">
    <CardHeader class="flex flex-row justify-between p-2">
      <div class="flex items-center gap-2">
        <GripVertical class="drag-handle cursor-pointer text-muted-foreground" />
        <Switch
          :id="`${props.item.layerId}`"
          :checked="props.item.isActive"
          @update:checked="
            (value) =>
              layerConfigStore.updateLayerVisibility(props.parentId, props.item.layerId, value)
          "
        />
        <Label class="cursor-pointer" :for="`${props.item.layerId}`">
          {{ props.item.alias }}
        </Label>
      </div>

      <ChevronDown
        class="cursor-pointer text-muted-foreground"
        @click="layerConfigStore.updateLayerExpandedState(props.item, true)"
        v-if="!layerConfigStore.isLayerExpanded(props.item.layerId)"
      />
      <ChevronUp
        class="cursor-pointer text-muted-foreground"
        @click="layerConfigStore.updateLayerExpandedState(props.item, false)"
        v-else
      />
    </CardHeader>

    <CardContent
      class="mb-2 flex flex-col p-2"
      v-if="props.item.isActive && layerConfigStore.isLayerExpanded(props.item.layerId)"
    >
      <div class="flex w-full flex-col gap-4 px-1">
        <div class="flex items-center gap-4">
          <span
            class="cursor-pointer text-muted-foreground"
            @click="() => console.log('zoom to extent')"
          >
            <Scan />
          </span>
          <span class="cursor-pointer text-muted-foreground" @click="toggleShowLegend">
            <List />
          </span>
          <span
            class="cursor-pointer text-muted-foreground"
            @click="() => console.log('identify layer')"
          >
            <Info />
          </span>
        </div>
        <div>
          <Slider
            :default-value="[props.item.opacity]"
            :max="100"
            :step="1"
            :disabled="!props.item.isActive"
            @update:modelValue="
              (value) =>
                layerConfigStore.updateLayerOpacity(props.parentId, props.item.layerId, value[0])
            "
          />
        </div>
      </div>
      <div class="mt-2" v-if="props.item.isActive && showLegend">
        <span class="divider"></span>
        <h1>show legend</h1>
      </div>
    </CardContent>
  </Card>
</template>
