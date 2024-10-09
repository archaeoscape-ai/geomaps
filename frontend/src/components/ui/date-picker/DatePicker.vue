<script setup>
import { ref, computed, watch } from 'vue'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { toDate } from 'radix-vue/date'
import { Calendar } from '@/components/ui/calendar'
import { DateFormatter } from '@internationalized/date'
import { FormControl, FormLabel, FormMessage, FormField, FormItem } from '@/components/ui/form'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelValue: {
    type: [String, Object],
    default: null,
  },
  label: String,
  name: String,
  placeholder: {
    type: String,
    default: 'Pick a date',
  },
})

const emit = defineEmits(['update:modelValue'])

const value = ref(props.modelValue)

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

watch(value, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>

<template>
  <FormField :name="name">
    <FormItem class="flex flex-col">
      <FormLabel>{{ label }}</FormLabel>
      <Popover>
        <PopoverTrigger as-child>
          <FormControl>
            <Button
              variant="outline"
              :class="cn('w-full ps-3 text-start font-normal', !value && 'text-muted-foreground')"
            >
              <span>{{ value ? df.format(toDate(value)) : placeholder }}</span>
              <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="value" />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
