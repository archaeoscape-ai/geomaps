<script setup>
import MainMap from '@/components/map/MainMap.vue'
import MapControls from '@/components/map/MapControls.vue';
import PanelButtons from '@/components/map/PanelButtons.vue';
</script>

<template>
  <div>
    <MainMap />
    <PanelButtons />
    <MapControls />

    <div class="absolute bottom-4 right-4 flex flex-col gap-4 bg-red-100">
      <button>1</button>
      <button>2</button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
