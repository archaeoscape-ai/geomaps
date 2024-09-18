<script setup>
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { storeToRefs } from 'pinia'

const leftPanelStore = useLeftPanelStore()
const { activePanel, tabs } = storeToRefs(leftPanelStore)
</script>

<template>
  <div
    class="absolute z-10 h-full w-96 bg-[#F2F5F8] shadow-[0px_2px_8px_0px_#0000001F] transition-all"
    :class="{
      'translate-x-0': activePanel !== null,
      '-translate-x-96': activePanel === null,
    }"
  >
    <div class="flex items-center divide-x">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex h-8 flex-grow items-center justify-center bg-primary text-center text-xs font-bold text-primary-foreground"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- panel content -->
    <div>
      <h1>Hello world</h1>
    </div>
  </div>
</template>
