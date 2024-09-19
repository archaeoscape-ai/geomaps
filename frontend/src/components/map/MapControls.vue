<script setup>
import { Plus, Minus } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'

const props = defineProps({
  isPanelActive: Boolean,
  map: Object,
})

function handleZoom(isZoomIn) {
  if (!props.map) return

  const map = props.map.map
  const view = map.getView()
  const newZoom = view.getZoom() + (isZoomIn ? 1 : -1)
  view.animate({ zoom: newZoom, duration: 250 })
}
</script>

<template>
  <div
    class="absolute bottom-4 left-4 transition-all"
    :class="{
      'translate-x-0': !isPanelActive,
      'translate-x-96': isPanelActive,
    }"
  >
    <div class="flex flex-col gap-3">
      <Button size="icon" variant="secondary" @click="handleZoom(true)">
        <Plus class="h-5 w-5" />
      </Button>

      <Button size="icon" variant="secondary" @click="handleZoom(false)">
        <Minus class="h-5 w-5" />
      </Button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
