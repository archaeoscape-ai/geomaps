<script setup>
import MainMap from '@/components/map/MainMap.vue'
import MapControls from '@/components/map/MapControls.vue';
import PanelButtons from '@/components/map/PanelButtons.vue';
import LeftPanelContainer from '@/components/panels/LeftPanelContainer.vue';


import { useLeftPanel } from '@/stores/LeftPanelStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue';

const leftPanelStore = useLeftPanel()
const { activePanel } = storeToRefs(leftPanelStore)

const isPanelActive = computed(() => activePanel.value !== null)
</script>

<template>
  <div>
    <MainMap />
    <LeftPanelContainer :isPanelActive="isPanelActive" />
    <PanelButtons :isPanelActive="isPanelActive" />
    <MapControls :isPanelActive="isPanelActive" />
    <div class="absolute bottom-4 right-4 flex flex-col gap-4 bg-red-100">
      <button>1</button>
      <button>2</button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
