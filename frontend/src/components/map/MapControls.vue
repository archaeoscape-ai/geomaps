<script setup>
import { Plus, Minus } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'

defineProps({
  isPanelActive: Boolean,
})
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
      <Button size="icon" variant="secondary">
        <Plus class="h-5 w-5" />
      </Button>

      <Button size="icon" variant="secondary">
        <Minus class="h-5 w-5" />
      </Button>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
