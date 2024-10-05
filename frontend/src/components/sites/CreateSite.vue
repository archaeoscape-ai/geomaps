<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import CreateSiteForm from '@/components/sites/CreateSiteForm.vue'
import { useSiteStore } from '@/stores/SiteStore'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'

const siteStore = useSiteStore()
const { isCreatingSite } = storeToRefs(siteStore)

onMounted(() => {
  isCreatingSite.value = true
  siteStore.setSiteMarker(null)
})

onBeforeUnmount(() => {
  isCreatingSite.value = false
  siteStore.setSiteMarker(null)
})
</script>

<template>
  <LeftPanelWrapper header="Create Site">
    <div class="flex flex-grow flex-col gap-4 overflow-auto">
      <CreateSiteForm class="px-4" />
    </div>
  </LeftPanelWrapper>
</template>
