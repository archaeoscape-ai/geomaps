<script setup>
import { Plus, Minus } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <div class="absolute bottom-4 left-4">
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
