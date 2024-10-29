<script setup>
import { storeToRefs } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import Button from '@/components/ui/button/Button.vue'
import { Filter, Search, SlidersHorizontal } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'
import SiteCard from '@/components/sites/SiteCard.vue'
import { useSiteStore } from '@/stores/SiteStore'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import { useMapStore } from '@/stores/MapStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import FormInputField from '@/components/ui/input/FormInputField.vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'

const formSchema = toTypedSchema(
  z.object({
    english_name: z.string().min(1, { message: 'This field has to be filled' }),
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

const form = useForm({
  validationSchema: formSchema,
})

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const siteStore = useSiteStore()
const { sites, page, pageSize, searchText } = storeToRefs(siteStore)

function fetchSites({ currentPage, currentPageSize }) {
  page.value = currentPage - 1
  pageSize.value = currentPageSize
  siteStore.getSites(currentMap.value?.id)
}

watchDebounced(
  searchText,
  (newValue) => {
    siteStore.getSites(currentMap.value?.id)
  },
  { debounce: 500, maxWait: 2000 },
)

const applyFilters = form.handleSubmit(async (values) => {
  console.log(values)
}) 
</script>

<template>
  <LeftPanelWrapper header="Sites">
    <template v-slot:header-actions>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button size="icon" variant="secondary" class="rounded-full">
            <SlidersHorizontal class="stroke-button-icon" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-96 text-sm pb-4">
          <form class="flex flex-col gap-4" @submit="applyFilters">
            <div class="max-h-96 overflow-auto p-4 h-full flex flex-col gap-4">
              <FormInputField name="english_name" label="English Name" />
              <FormInputField name="french_name" label="French Name" />
              <FormInputField name="khmer_name" label="Khmer Name" />
            </div>
            <Button type="submit" class="self-end mr-4">Filter</Button>
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
