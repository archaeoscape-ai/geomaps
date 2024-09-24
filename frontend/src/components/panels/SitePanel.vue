<script setup>
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { storeToRefs } from 'pinia'
import Button from '@/components/ui/button/Button.vue'
import { X, Filter, Search } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'
import SiteCard from '@/components/sites/SiteCard.vue'
import { onMounted } from 'vue'
import { useSiteStore } from '@/stores/SiteStore'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import { watchDebounced } from '@vueuse/core'

const leftPanelStore = useLeftPanelStore()
const { activePanel, tabs } = storeToRefs(leftPanelStore)

const siteStore = useSiteStore()
const { sites, page, pageSize, searchText } = storeToRefs(siteStore)

onMounted(() => {
  siteStore.getSites(1)
})

function handleFetchSites({ currentPage, currentPageSize }) {
  page.value = currentPage - 1
  pageSize.value = currentPageSize
  siteStore.getSites(1)
}

watchDebounced(
  searchText,
  (newValue) => {
    siteStore.getSites(1)
  },
  { debounce: 500, maxWait: 2000 },
)
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h2 class="font-bold">Sites</h2>
      <div class="flex gap-4">
        <Button size="icon" variant="secondary" class="rounded-full" @click="activePanel = null">
          <Filter class="stroke-button-icon" />
        </Button>

        <Button
          size="icon"
          variant="secondary"
          class="rounded-full bg-white"
          @click="activePanel = null"
        >
          <X class="stroke-button-icon" />
        </Button>
      </div>
    </div>

    <div class="relative mt-3 w-full">
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
    <hr class="mt-3" />
  </div>

  <div class="flex flex-grow flex-col gap-4 overflow-auto px-4">
    <SiteCard :site="site" v-for="site in sites?.results" :key="site.id" />
  </div>

  <div class="flex justify-center p-3">
    <Pagination
      :totalRecords="sites?.count || 0"
      :page="page"
      :pageSize="pageSize"
      @fetchData="handleFetchSites"
    />
  </div>
</template>
