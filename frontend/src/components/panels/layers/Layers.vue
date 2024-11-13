<script setup>
import { computed, ref, watch } from 'vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Label from '@/components/ui/label/Label.vue'
import { GripVertical, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import LayerItem from './LayerItem.vue'
import draggable from 'vuedraggable'
import { storeToRefs } from 'pinia'

const props = defineProps({
  layer: { type: Object, required: true },
})

const parentExpanded = ref(false)
const layerConfigStore = useMapLayerConfigStore()
const { allLayersExpanded, searchText } = storeToRefs(layerConfigStore)

const isEmpty = computed(() => props.layer.items.length === 0)

const isParentActive = computed(
  () => props.layer.items.length > 0 && props.layer.items.every((item) => item.isActive),
)


function handleParentExpansion() {
  parentExpanded.value = !parentExpanded.value
}

watch(allLayersExpanded, (newValue) => {
  if (newValue && props.layer.items.some((layer) => layer.isActive)) {
    parentExpanded.value = newValue
  }
})
</script>

<template>
  <div class="px-4">
    <Card>
      <CardContent class="p-2">
        <div class="flex items-center gap-2">
          <GripVertical class="drag-handle cursor-pointer stroke-button-icon" />
          <Switch
            :id="layer.id"
            :checked="isParentActive"
            :disabled="isEmpty"
            @update:checked="(value) => layerConfigStore.setLayerItemsActiveState(layer, value)"
          />
          <Label
            class="cursor-pointer font-semibold"
            :class="{
              'text-black/50': isEmpty,
            }"
            :for="layer.id"
            >{{ layer.title }}</Label
          >
        </div>

        <ChevronDown
          class="cursor-pointer stroke-button-icon"
          @click="handleParentExpansion"
          v-if="!parentExpanded || isEmpty"
        />
        <ChevronUp
          class="cursor-pointer stroke-button-icon"
          @click="handleParentExpansion"
          v-else
        />
      </CardContent>
    </Card>

    <div class="ml-6" v-if="parentExpanded">
      <draggable
        :list="layer.items"
        class="flex flex-col"
        ghostClass="opacity-50"
        item-key="id"
        handle=".drag-handle"
        :animation="250"
      >
        <template #item="{ element }">
          <LayerItem
            :item="element"
            :parentId="layer.id"
            v-if="element.alias.toLowerCase().includes(searchText.toLowerCase())"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>
