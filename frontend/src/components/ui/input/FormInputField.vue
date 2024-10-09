<script setup>
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const props = defineProps({
  label: String,
  name: String,
  type: { type: [String, File], default: 'text' },
})

const emit = defineEmits(['file-change'])
</script>

<template>
  <FormField v-slot="{ componentField }" :name="name">
    <FormItem>
      <FormLabel>{{ label }}</FormLabel>
      <FormControl>
        <template v-if="type === 'file'">
          <Input :type="type" @change="(event) => emit('file-change', event.target.files)" />
        </template>
        <template v-else>
          <Input :type="type" v-bind="componentField" />
        </template>
      </FormControl>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
