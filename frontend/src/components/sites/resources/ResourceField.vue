<script setup>
import Separator from '@/components/ui/separator/Separator.vue'

const props = defineProps({
  label: String,
  value: [String, Number],
  showDivider: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div>
    <div class="grid grid-cols-2 items-center gap-2 break-words py-2">
      <div class="font-semibold">{{ label }}</div>
      <div>{{ value }}</div>
    </div>

    <Separator v-if="showDivider" />
  </div>
</template>
