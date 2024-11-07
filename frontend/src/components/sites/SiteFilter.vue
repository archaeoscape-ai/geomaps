<script setup>
import { storeToRefs } from 'pinia'
import Button from '@/components/ui/button/Button.vue'
import { useSiteStore } from '@/stores/SiteStore'
import { useMapStore } from '@/stores/MapStore'
import FormInputField from '@/components/ui/input/FormInputField.vue'
import FormCheckboxField from '@/components/ui/checkbox/FormCheckboxField.vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'
import { RangeCalendar } from '@/components/ui/range-calendar'

import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const siteStore = useSiteStore()
const { getSites } = siteStore
const { siteFilters, isShowingFilter } = storeToRefs(siteStore)

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const formSchema = toTypedSchema(
  z.object({
    english_name: z.string().optional(),
    french_name: z.string().optional(),
    khmer_name: z.string().optional(),
    alternative_name: z.string().optional(),
    alternative_khmer_name: z.string().optional(),
    description: z.string().optional(),
    ik_id_starred: z.boolean().default(false).optional(),
    created_by: z.string().optional(),
  }),
)

const { resetForm, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const created_on_range = computed({
  get: () => {
    return {
      start: siteFilters.value.created_on_gte ? parseDate(siteFilters.value.created_on_gte) : undefined,
      end: siteFilters.value.created_on_lte ? parseDate(siteFilters.value.created_on_lte) : undefined,
    }
  },
  set: (val) => {
    siteFilters.value.created_on_gte = val.start?.toString()
    siteFilters.value.created_on_lte = val.end?.toString()
  },
})

const updated_on_range = computed({
  get: () => {
    return {
      start: siteFilters.value.updated_on_gte ? parseDate(siteFilters.value.updated_on_gte) : undefined,
      end: siteFilters.value.updated_on_lte ? parseDate(siteFilters.value.updated_on_lte) : undefined,
    }
  },
  set: (val) => {
    siteFilters.value.updated_on_gte = val.start?.toString()
    siteFilters.value.updated_on_lte = val.end?.toString()
  },
})

const applyFilters = async () => {
  await getSites(currentMap.value?.id)
  isShowingFilter.value = !isShowingFilter.value
}

async function clearFilters() {
  resetForm({
    values: {
      english_name: '',
      french_name: '',
      khmer_name: '',
      alternative_name: '',
      alternative_khmer_name: '',
      description: '',
      ik_id_starred: false,
      created_by: '',
    },
  })

  siteFilters.value = {
    english_name: '',
    french_name: '',
    khmer_name: '',
    alternative_name: '',
    alternative_khmer_name: '',
    description: '',
    ik_id_starred: false,
    created_on_gte: '',
    created_on_lte: '',
    updated_on_gte: '',
    updated_on_lte: '',
    created_by: '',
  }
}
</script>

<template>
  <form class="flex flex-grow flex-col gap-4 overflow-hidden pb-4" @submit.prevent="applyFilters">
    <div class="flex flex-grow flex-col gap-4 overflow-auto p-4">
      <FormInputField name="english_name" label="English Name" v-model="siteFilters.english_name" />
      <FormInputField name="french_name" label="French Name" v-model="siteFilters.french_name" />
      <FormInputField name="khmer_name" label="Khmer Name" v-model="siteFilters.khmer_name" />
      <FormInputField
        name="alternative_name"
        label="Alternative Name"
        v-model="siteFilters.alternative_name"
      />
      <FormInputField
        name="alternative_khmer_name"
        label="Alternative Khmer Name"
        v-model="siteFilters.alternative_khmer_name"
      />
      <FormInputField name="description" label="Description" v-model="siteFilters.description" />
      <FormCheckboxField
        name="ik_id_starred"
        label="IK ID Starred"
        v-model="siteFilters.ik_id_starred"
      />
      <FormInputField name="created_by" label="Created by" v-model="siteFilters.created_by" />
      <FormField name="created_on">
        <FormItem class="flex flex-col">
          <FormLabel>Created on</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !created_on_range && 'text-muted-foreground',
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <template v-if="created_on_range.start">
                  <template v-if="created_on_range.end">
                    {{ df.format(created_on_range.start.toDate(getLocalTimeZone())) }} -
                    {{ df.format(created_on_range.end.toDate(getLocalTimeZone())) }}
                  </template>

                  <template v-else>
                    {{ df.format(created_on_range.start.toDate(getLocalTimeZone())) }}
                  </template>
                </template>
                <template v-else> Pick a date </template>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <RangeCalendar
                v-model="created_on_range"
                initial-focus
                :number-of-months="2"
                @update:start-value="(startDate) => (created_on_range.start = startDate)"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField name="updated_on">
        <FormItem class="flex flex-col">
          <FormLabel>Updated on</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                :class="
                  cn(
                    'w-full justify-start text-left font-normal',
                    !updated_on_range && 'text-muted-foreground',
                  )
                "
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                <template v-if="updated_on_range.start">
                  <template v-if="updated_on_range.end">
                    {{ df.format(updated_on_range.start.toDate(getLocalTimeZone())) }} -
                    {{ df.format(updated_on_range.end.toDate(getLocalTimeZone())) }}
                  </template>

                  <template v-else>
                    {{ df.format(updated_on_range.start.toDate(getLocalTimeZone())) }}
                  </template>
                </template>
                <template v-else> Pick a date </template>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <RangeCalendar
                v-model="updated_on_range"
                initial-focus
                :number-of-months="2"
                @update:start-value="(startDate) => (updated_on_range.start = startDate)"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>
    <div class="flex items-center self-end">
      <Button
        class="mr-4 hover:bg-gray-200"
        variant="secondary"
        @click.prevent="clearFilters"
        :disable="isSubmitting"
      >
        Clear Filter
      </Button>
      <Button type="submit" class="mr-4 self-end" :disable="isSubmitting"> Search </Button>
    </div>
  </form>
</template>
