<script setup>
import { computed, ref } from 'vue'
import Switch from '@/components/ui/switch/Switch.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'
import { Search } from 'lucide-vue-next'
import Layers from './layers/Layers.vue'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'

const layerConfigStore = useMapLayerConfigStore()
const { layerConfig, allLayersToggledOn, allLayersExpanded } = storeToRefs(layerConfigStore)

const list = computed({
  get: () => layerConfig.value,
})
</script>

<template>
  <div class="px-4 py-2 text-lg font-bold">Layer Panel</div>

  <div class="mt-4 px-4">
    <div class="relative">
      <Input id="search" type="text" placeholder="Search layers" class="pl-10" />
      <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
        <Search class="size-5 text-muted-foreground" />
      </span>
    </div>
  </div>

  <div class="mt-4 flex justify-between px-4">
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

  <div class="">
    <draggable
      :list="list"
      class="flex h-[calc(100dvh-150px)] flex-grow flex-col overflow-auto pb-6"
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
