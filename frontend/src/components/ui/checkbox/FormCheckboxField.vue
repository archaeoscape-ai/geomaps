<script setup>
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

const props = defineProps({
  label: String,
  name: String,
})
</script>

<template>
  <FormField v-slot="{ value, handleChange }" :name="name">
    <FormItem>
      <div class="flex items-center gap-2">
        <FormControl>
          <Checkbox :checked="value" @update:checked="handleChange" :name="name" />
        </FormControl>
        <FormLabel>{{ label }}</FormLabel>
      </div>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
