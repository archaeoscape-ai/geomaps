<script setup>
import { useRightPanelStore } from '@/stores/RightPanelStore'
import { storeToRefs } from 'pinia'
import LayerPanel from './LayerPanel.vue'
import { RIGHT_PANELS } from '@/helpers/constants'
import NotePanel from './NotePanel.vue'

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

const componentMapping = {
  [RIGHT_PANELS.LAYER]: LayerPanel,
  [RIGHT_PANELS.NOTE]: NotePanel,
}
</script>

<template>
  <div
    class="absolute right-0 z-10 flex h-full w-full sm:w-96 flex-col bg-[#F2F5F8] shadow-[0px_2px_8px_0px_#0000001F] transition-all"
    :class="{
      'translate-x-0': activePanel !== null,
      'translate-x-full': activePanel === null,
    }"
  >
    <component v-if="activePanel" :is="componentMapping[activePanel]" />
  </div>
</template>
