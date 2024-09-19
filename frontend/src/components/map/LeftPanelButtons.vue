<script setup>
import { MapPin, Share2 } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import GpsIcon from '@/assets/gps-icon.svg?component'
import RulerIcon from '@/assets/ruler-icon.svg?component'
import SaveIcon from '@/assets/save-icon.svg?component'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'

defineProps({
  isPanelActive: Boolean,
})

const leftPanelStore = useLeftPanelStore()
const { toggleMenu } = leftPanelStore
</script>

<template>
  <div
    class="absolute left-4 top-4 transition-all"
    :class="{
      'translate-x-0': !isPanelActive,
      'translate-x-96': isPanelActive,
    }"
  >
    <div class="flex flex-col gap-3">
      <Button size="icon" @click="toggleMenu">
        <MapPin class="h-4.5 w-4.5" />
      </Button>

      <!-- TODO: Get current user location and add a pin -->
      <Button size="icon">
        <GpsIcon />
      </Button>

      <!-- TODO: Distance -->
      <Button size="icon">
        <RulerIcon />
      </Button>

      <!-- TODO: Share map -->
      <Button size="icon">
        <Share2 class="h-4.5 w-4.5" />
      </Button>

      <Button size="icon">
        <SaveIcon />
      </Button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
