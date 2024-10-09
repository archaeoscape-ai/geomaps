<template>
  <div class="grid grid-cols-2 items-center gap-2 break-words py-1">
    <div class="font-semibold">{{ label }}</div>
    <div>{{ value }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  value: [String, Number],
})
</script>
