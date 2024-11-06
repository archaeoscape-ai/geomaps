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
import { computed, ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DateFormatter, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'radix-vue/date'

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
    created_on: z.string().optional(),
    updated_on: z.string().optional(),
    created_by: z.string().optional(),
  }),
)

const placeholder = ref()

const { resetForm, isSubmitting, setFieldValue } = useForm({
  validationSchema: formSchema,
})

const created_on = computed({
  get: () => (siteFilters.value.created_on ? parseDate(siteFilters.value.created_on) : undefined),
  set: (val) => {
    siteFilters.value.created_on = val.toString()
  },
})

const updated_on = computed({
  get: () => (siteFilters.value.updated_on ? parseDate(siteFilters.value.updated_on) : undefined),
  set: (val) => {
    siteFilters.value.updated_on = val.toString()
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
      created_on: '',
      updated_on: '',
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
    created_on: '',
    updated_on: '',
    created_by: '',
  }

  applyFilters()
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
              <FormControl>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'w-[240px] ps-3 text-start font-normal',
                      !created_on && 'text-muted-foreground',
                    )
                  "
                >
                  <span>{{ created_on ? df.format(toDate(created_on)) : 'Pick a date' }}</span>
                  <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                </Button>
                <input hidden />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar
                v-model:placeholder="placeholder"
                v-model="created_on"
                calendar-label="Created On"
                initial-focus
                :max-value="today(getLocalTimeZone())"
                @update:model-value="
                  (v) => {
                    if (v) {
                      setFieldValue('created_on', v.toString())
                    } else {
                      setFieldValue('created_on', undefined)
                    }
                  }
                "
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
              <FormControl>
                <Button
                  variant="outline"
                  :class="
                    cn(
                      'w-[240px] ps-3 text-start font-normal',
                      !updated_on && 'text-muted-foreground',
                    )
                  "
                >
                  <span>{{ updated_on ? df.format(toDate(updated_on)) : 'Pick a date' }}</span>
                  <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                </Button>
                <input hidden />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
              <Calendar
                v-model:placeholder="placeholder"
                v-model="updated_on"
                calendar-label="Created On"
                initial-focus
                :max-value="today(getLocalTimeZone())"
                @update:model-value="
                  (v) => {
                    if (v) {
                      setFieldValue('updated_on', v.toString())
                    } else {
                      setFieldValue('updated_on', undefined)
                    }
                  }
                "
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
