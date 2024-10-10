<script setup>
import Button from '@/components/ui/button/Button.vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'
import { Search } from 'lucide-vue-next'
import Layers from './layers/Layers.vue'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { X } from 'lucide-vue-next'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import Card from '../ui/card/Card.vue'
import CardContent from '../ui/card/CardContent.vue'

const layerConfigStore = useMapLayerConfigStore()
const { tempLayerConfig, allLayersToggledOn, allLayersExpanded, searchText } =
  storeToRefs(layerConfigStore)

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

function searchLayer(evt) {
  searchText.value = evt.target.value
}
</script>

<template>
  <div class="flex h-full flex-col gap-4">
    <div class="flex items-center justify-between p-4 pb-0">
      <h2 class="font-bold">Layers</h2>
      <Button
        size="icon"
        variant="secondary"
        class="rounded-full bg-white"
        @click="activePanel = null"
      >
        <X class="stroke-button-icon" />
      </Button>
    </div>

    <div class="px-4">
      <div class="relative w-full">
        <Input
          id="search"
          type="text"
          placeholder="Search layers"
          class="pl-10"
          @input="searchLayer"
        />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
          <Search class="size-5 stroke-button-icon" />
        </span>
      </div>
    </div>
    <div class="flex justify-between px-4">
      <div class="flex items-center gap-2">
        <Switch
          id="toggle-all"
          :checked="allLayersToggledOn"
          @update:checked="layerConfigStore.setAllLayersActiveState"
        />
        <Label class="cursor-pointer" for="toggle-all">{{
          allLayersToggledOn ? 'Turn Off All' : 'Turn On All'
        }}</Label>
      </div>
      <button
        class="basis-20 cursor-pointer text-xs font-semibold underline"
        @click="!layerConfigStore.setAllLayersExpandedState(!allLayersExpanded)"
      >
        {{ allLayersExpanded ? 'Collapse All' : 'Expand All' }}
      </button>
    </div>
    <div class="px-4">
      <Card>
        <CardContent class="p-2">

        </CardContent>
      </Card>
    </div>
    <draggable
      :list="tempLayerConfig"
      class="flex flex-grow flex-col overflow-auto"
      ghostClass="opacity-50"
      item-key="id"
      handle=".drag-handle"
      :animation="250"
    >
      <template #item="{ element }">
        <Layers :layer="element" class="mt-4" />
      </template>
    </draggable>
  </div>
</template>
