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

const parentExpanded = ref(false)
const layerConfigStore = useMapLayerConfigStore()
const { allLayersExpanded } = storeToRefs(layerConfigStore)

const isParentActive = computed(() => props.layer.items.every((item) => item.isActive))

function handleParentExpansion() {
  parentExpanded.value = !parentExpanded.value
}

const props = defineProps({
  layer: { type: Object, required: true },
})

const list = computed({
  get: () => props.layer.items,
  set: (value) => console.log(value),
})

watch(allLayersExpanded, (newValue) => {
  if (newValue) {
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
            :id="props.layer.id"
            :checked="isParentActive"
            @update:checked="
              (value) => layerConfigStore.setLayerItemsActiveState(props.layer, value)
            "
          />
          <Label class="cursor-pointer font-semibold" :for="props.layer.id">{{
            props.layer.title
          }}</Label>
        </div>

        <ChevronDown
          class="cursor-pointer stroke-button-icon"
          @click="handleParentExpansion"
          v-if="!parentExpanded"
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
        :list="list"
        class="flex flex-col"
        ghostClass="opacity-50"
        item-key="id"
        handle=".drag-handle"
        :animation="250"
      >
        <template #item="{ element }">
          <LayerItem :item="element" :parentId="props.layer.id" />
        </template>
      </draggable>
    </div>
  </div>
</template>
