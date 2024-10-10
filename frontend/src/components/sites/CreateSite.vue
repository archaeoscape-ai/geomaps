<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import CreateSiteForm from '@/components/sites/CreateSiteForm.vue'
import { useSiteStore } from '@/stores/SiteStore'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import IconTooltipButton from '@/components/ui/tooltip/IconTooltipButton.vue'
import { Ban } from 'lucide-vue-next'
import { LEFT_PANELS } from '@/helpers/constants'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'

const leftPanelStore = useLeftPanelStore()
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

const cancelSiteCreation = () => {
  isCreatingSite.value = false
  siteStore.setSiteMarker(null)
  leftPanelStore.setTab(LEFT_PANELS.LIST)
}
</script>

<template>
  <LeftPanelWrapper header="Create Site">
    <template v-slot:header-actions v-if="isCreatingSite">
      <IconTooltipButton tooltipText="Cancel" tooltipSide="bottom" @onBtnClick="cancelSiteCreation">
        <Ban size="20" />
      </IconTooltipButton>
    </template>

    <div class="flex flex-grow flex-col gap-4 overflow-auto">
      <CreateSiteForm class="px-4" />
    </div>
  </LeftPanelWrapper>
</template>
