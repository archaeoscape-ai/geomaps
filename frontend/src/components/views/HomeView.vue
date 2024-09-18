<script setup>
import MainMap from '@/components/map/MainMap.vue'
import PanelButtons from '@/components/map/PanelButtons.vue'
import LeftPanelContainer from '@/components/panels/LeftPanelContainer.vue'

import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const leftPanelStore = useLeftPanelStore()
const { activePanel } = storeToRefs(leftPanelStore)

const isPanelActive = computed(() => activePanel.value !== null)
</script>

<template>
  <div>
    <MainMap :isPanelActive="isPanelActive" />
    <LeftPanelContainer :isPanelActive="isPanelActive" />
    <PanelButtons :isPanelActive="isPanelActive" />
    <div class="absolute bottom-4 right-4 flex flex-col gap-4 bg-red-100">
      <button>1</button>
      <button>2</button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
