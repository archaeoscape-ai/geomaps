<script setup>
import { storeToRefs } from 'pinia'
import { watchDebounced } from '@vueuse/core'
import { Search, SlidersHorizontal } from 'lucide-vue-next'
import Input from '@/components/ui/input/Input.vue'
import SiteCard from '@/components/sites/SiteCard.vue'
import { useSiteStore } from '@/stores/SiteStore'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import { useMapStore } from '@/stores/MapStore'
import { computed, ref } from 'vue'
import SiteFilter from '../sites/SiteFilter.vue'
import IconTooltipButton from '@/components/ui/tooltip/IconTooltipButton.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import { ArrowLeft } from 'lucide-vue-next'

const filterPanelOpen = ref(false)

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const siteStore = useSiteStore()
const { getSites } = siteStore
const { sites, page, pageSize, searchText, siteFilters, isShowingFilter } = storeToRefs(siteStore)

const hasFilters = computed(() => {
  const res = Object.values(siteFilters.value).some((field) => field)
  return res
})

function fetchSites({ currentPage, currentPageSize }) {
  page.value = currentPage
  pageSize.value = currentPageSize
  siteStore.getSites(currentMap.value.id)
}

watchDebounced(
  searchText,
  () => {
    filterPanelOpen.value = false
    getSites(currentMap.value?.id)
  },
  { debounce: 500, maxWait: 2000 },
)
</script>

<template>
  <LeftPanelWrapper :header="!isShowingFilter ? 'Sites' : 'Site Filters'">
    <template v-slot:header-actions>
      <IconTooltipButton
        tooltipText="Filters"
        tooltipSide="bottom"
        @onBtnClick="isShowingFilter = !isShowingFilter"
        v-if="!isShowingFilter"
      >
        <SlidersHorizontal color="#AB1C28" v-show="hasFilters" />
        <SlidersHorizontal class="stroke-button-icon" v-show="!hasFilters" />
      </IconTooltipButton>
      <IconTooltipButton
        tooltipText="Cancel"
        tooltipSide="bottom"
        @onBtnClick="isShowingFilter = !isShowingFilter"
        v-else
      >
        <ArrowLeft size="20" />
      </IconTooltipButton>
    </template>

    <div class="px-4" v-show="!isShowingFilter">
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

    <template v-if="!isShowingFilter">
      <div class="flex flex-grow flex-col gap-4 overflow-auto pb-4 pl-4 pr-2.5">
        <SiteCard :site="site" v-for="site in sites?.results" :key="site.id" />
      </div>
    </template>
    <template v-else>
      <SiteFilter />
    </template>

    <div class="flex justify-center p-3">
      <Pagination
        :totalRecords="sites?.count || 0"
        :page="page"
        :pageSize="pageSize"
        @fetchData="fetchSites"
      />
    </div>
  </LeftPanelWrapper>
</template>
