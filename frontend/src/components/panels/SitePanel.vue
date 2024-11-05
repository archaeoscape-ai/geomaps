<script setup>
import { storeToRefs } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import Button from '@/components/ui/button/Button.vue'
import { Search, SlidersHorizontal } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'
import SiteCard from '@/components/sites/SiteCard.vue'
import { useSiteStore } from '@/stores/SiteStore'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import { useMapStore } from '@/stores/MapStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import FormInputField from '@/components/ui/input/FormInputField.vue'
import FormCheckboxField from '@/components/ui/checkbox/FormCheckboxField.vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date'
import { toDate } from 'radix-vue/date'

import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const filterPanelOpen = ref(false)

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const siteStore = useSiteStore()
const { getSites } = siteStore
const { sites, page, pageSize, searchText, siteFilters } = storeToRefs(siteStore)

const hasFilters = computed(() => {
  const res = Object.values(siteFilters.value).some((field) => field)
  return res
})

function fetchSites({ currentPage, currentPageSize }) {
  page.value = currentPage - 1
  pageSize.value = currentPageSize
  siteStore.getSites(currentMap.value?.id)
}

watchDebounced(
  searchText,
  () => {
    filterPanelOpen.value = false
    getSites(currentMap.value?.id)
  },
  { debounce: 500, maxWait: 2000 },
)

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
  filterPanelOpen.value = false
  getSites(currentMap.value?.id)
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

  filterPanelOpen.value = false
  getSites(currentMap.value?.id)
}
</script>

<template>
  <LeftPanelWrapper header="Sites">
    <template v-slot:header-actions>
      <DropdownMenu v-model:open="filterPanelOpen">
        <DropdownMenuTrigger as-child>
          <Button size="icon" variant="secondary" class="rounded-full">
            <SlidersHorizontal color="#AB1C28" v-show="hasFilters" />
            <SlidersHorizontal class="stroke-button-icon" v-show="!hasFilters" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-96 pb-4 text-sm">
          <form class="flex flex-col" @submit.prevent="applyFilters">
            <div class="flex h-full max-h-96 flex-col gap-4 overflow-auto p-4">
              <FormInputField
                name="english_name"
                label="English Name"
                v-model="siteFilters.english_name"
              />
              <FormInputField
                name="french_name"
                label="French Name"
                v-model="siteFilters.french_name"
              />
              <FormInputField
                name="khmer_name"
                label="Khmer Name"
                v-model="siteFilters.khmer_name"
              />
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
              <FormInputField
                name="description"
                label="Description"
                v-model="siteFilters.description"
              />
              <FormCheckboxField
                name="ik_id_starred"
                label="IK ID Starred"
                v-model="siteFilters.ik_id_starred"
              />
              <FormInputField
                name="created_by"
                label="Created by"
                v-model="siteFilters.created_by"
              />
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
                          <span>{{
                            created_on ? df.format(toDate(created_on)) : 'Pick a date'
                          }}</span>
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
                          <span>{{
                            updated_on ? df.format(toDate(updated_on)) : 'Pick a date'
                          }}</span>
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
                class="mr-4"
                variant="secondary"
                @click.prevent="clearFilters"
                :disable="isSubmitting"
              >
                Clear Filter
              </Button>
              <Button type="submit" class="mr-4 self-end" :disable="isSubmitting"> Search </Button>
            </div>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>

    <div class="px-4">
      <div class="relative w-full">
        <Input
          id="search"
          type="text"
          placeholder="Search sites"
          class="pl-10"
          v-model="searchText"
        />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
          <Search class="size-5 stroke-button-icon" />
        </span>
      </div>
      <hr class="my-3" />
    </div>

    <div class="flex flex-grow flex-col gap-4 overflow-auto pb-4 pl-4 pr-2.5">
      <SiteCard :site="site" v-for="site in sites?.results" :key="site.id" />
    </div>

    <!-- <div class="flex justify-center p-3">
      <Pagination
        :totalRecords="sites?.count || 0"
        :page="page"
        :pageSize="pageSize"
        @fetchData="fetchSites"
      />
    </div> -->
  </LeftPanelWrapper>
</template>
