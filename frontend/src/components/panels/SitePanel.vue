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
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const siteStore = useSiteStore()
const { getSites } = siteStore
const { sites, page, pageSize, searchText, siteFilters } = storeToRefs(siteStore)

const hasFilters = computed(() => {
  const res =  Object.values(siteFilters.value).some(field => field)
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
    getSites(currentMap.value?.id)
  },
  { debounce: 500, maxWait: 2000 },
)

const formSchema = toTypedSchema(
  z.object({
    english_name: z.string().optional(),
    french_name: z.string().optional(),
    khmer_name: z.string().optional(),
    // latitude: z.coerce.number().gte(-90).lte(90, { message: 'Invalid Latitude' }),
    // longitude: z.coerce.number().gte(-180).lte(180, { message: 'Invalid Longitude' }),
    // alternative_name: z.string().optional(),
    // alternative_khmer_name: z.string().optional(),
    // description: z.string().optional(),
    // ik_id_starred: z.boolean().default(false).optional(),
    // site_type: z.string().optional(),
    // inventaire_khmere_id: z.string().optional(),
    // monuments_hostoriques_id: z.string().optional(),
  }),
)

const { resetForm, isSubmitting, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const applyFilters = handleSubmit(async (values) => {
  getSites(currentMap.value?.id)
})

async function clearFilters() {
  resetForm({
    values: {
      english_name: '',
      french_name: '',
      khmer_name: '',
    },
  })
  applyFilters()
}
</script>

<template>
  <LeftPanelWrapper header="Sites">
    <template v-slot:header-actions>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" variant="secondary" class="rounded-full">
            <SlidersHorizontal color="#AB1C28" v-show="hasFilters"/>
            <SlidersHorizontal class="stroke-button-icon" v-show="!hasFilters"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-96 pb-4 text-sm">
          <form class="flex flex-col" @submit="applyFilters">
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
