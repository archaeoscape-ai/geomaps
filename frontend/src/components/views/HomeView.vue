<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import MainMap from '@/components/map/MainMap.vue'
import LeftPanelButtons from '@/components/map/LeftPanelButtons.vue'
import RightPanelButtons from '@/components/map/RightPanelButtons.vue'
import LeftPanelContainer from '@/components/panels/LeftPanelContainer.vue'
import RightPanelContainer from '@/components/panels/RightPanelContainer.vue'

import { useRightPanelStore } from '@/stores/RightPanelStore'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import BaseMapButtons from '@/components/map/BaseMapButtons.vue'

const leftPanelStore = useLeftPanelStore()
const { activePanel } = storeToRefs(leftPanelStore)

const rightPanelStore = useRightPanelStore()
const { activePanel: activeRightPanel } = storeToRefs(rightPanelStore)

const isLeftPanelActive = computed(() => activePanel.value !== null)
const isRightPanelActive = computed(() => activeRightPanel.value !== null)
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden">
    <MainMap :isPanelActive="isLeftPanelActive" />
    <LeftPanelContainer :isPanelActive="isLeftPanelActive" />
    <LeftPanelButtons :isPanelActive="isLeftPanelActive" />
    <RightPanelButtons :isPanelActive="isRightPanelActive" />
    <RightPanelContainer :isPanelActive="isRightPanelActive" />
    <BaseMapButtons :isPanelActive="isRightPanelActive" />
  </div>
</template>

<style lang="postcss" scoped></style>
