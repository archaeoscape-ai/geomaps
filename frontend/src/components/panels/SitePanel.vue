<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import Button from '@/components/ui/button/Button.vue'
import { Filter, Search } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'
import SiteCard from '@/components/sites/SiteCard.vue'
import { useSiteStore } from '@/stores/SiteStore'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import { useMapStore } from '@/stores/MapStore'

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
</script>

<template>
  <LeftPanelWrapper header="Sites">
    <template v-slot:header-actions>
      <Button size="icon" variant="secondary" class="rounded-full" @click="console.log('filters')">
        <Filter class="stroke-button-icon" />
      </Button>
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

    <div class="flex flex-grow flex-col gap-4 overflow-auto pl-4 pr-2.5 pb-4">
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
