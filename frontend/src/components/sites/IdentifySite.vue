<script setup>
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { useSiteStore } from '@/stores/SiteStore'
import { useMapStore } from '@/stores/MapStore'
import { useNoteStore } from '@/stores/NoteStore'
import { useSiteResourceStore } from '@/stores/SiteResourceStore'
import CreateSiteForm from '@/components/sites/CreateSiteForm.vue'
import CreateSiteResourceForm from '@/components/sites/resources/CreateSiteResourceForm.vue'
import SiteDetail from '@/components/sites/SiteDetail.vue'
import SiteResources from '@/components/sites/resources/SiteResources.vue'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import DeleteSiteDialog from './DeleteSiteDialog.vue'
import { Trash, ArrowLeft, RefreshCcw } from 'lucide-vue-next'
import IconTooltipButton from '@/components/ui/tooltip/IconTooltipButton.vue'
import { useAuthStore } from '@/stores/AuthStore'


const authStore = useAuthStore()
const { isReadOnly } = storeToRefs(authStore)

const mapStore = useMapStore()
const { measuringDistance } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { isDisplayingNoteCursor } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { selectedSite, isEditingSite, selectedSiteFeature, isLoading } = storeToRefs(siteStore)

const siteResourceStore = useSiteResourceStore()
const { isAddingResource, updatingResource } = storeToRefs(siteResourceStore)

const heading = computed(() => {
  return updatingResource.value
    ? 'Update Resource'
    : isAddingResource.value
      ? 'Add Resource'
      : isEditingSite.value
        ? 'Update Site'
        : 'Site Details'
})

function toggleSiteEdit() {
  isEditingSite.value = !isEditingSite.value
  isAddingResource.value = false
  if (!isEditingSite.value && selectedSite.value) {
    siteStore.resetSitePosition()
  }
}

function cancelAddResource() {
  isAddingResource.value = false
  updatingResource.value = null
}

onBeforeUnmount(() => {
  isEditingSite.value = false
  isAddingResource.value = false
  updatingResource.value = null
})

onMounted(() => {
  const id = selectedSiteFeature.value?.get('id')
  if (!id) return
  if (id === selectedSite.value?.id) return

  isAddingResource.value = false
  updatingResource.value = null
  siteResourceStore.getSiteResources(id)
})
</script>

<template>
  <LeftPanelWrapper :header="heading">
    <template v-slot:header-actions v-if="selectedSite">
      <template v-if="!isAddingResource && !updatingResource">
        <DeleteSiteDialog :site-id="selectedSite?.id" v-if="!isEditingSite && !isReadOnly">
          <IconTooltipButton tooltipText="Delete" tooltipSide="bottom">
            <Trash class="stroke-primary" size="20" />
          </IconTooltipButton>
        </DeleteSiteDialog>

        <IconTooltipButton
          tooltipText="Cancel"
          tooltipSide="bottom"
          @onBtnClick="toggleSiteEdit"
          :disabled="measuringDistance || isDisplayingNoteCursor"
          v-if="isEditingSite"
        >
          <ArrowLeft size="20" />
        </IconTooltipButton>
      </template>
      <template v-else>
        <IconTooltipButton
          tooltipText="Go back"
          tooltipSide="bottom"
          @onBtnClick="cancelAddResource"
        >
          <ArrowLeft size="20" />
        </IconTooltipButton>
      </template>
    </template>

    <div v-if="isLoading" class="mx-4 flex flex-grow justify-center items-center">
      <RefreshCcw class="w-4 h-4 mr-2 animate-spin" />
      Loading
    </div>
    <div class="flex flex-grow flex-col gap-4 overflow-auto pb-4" v-else-if="selectedSite">
      <CreateSiteForm v-if="isEditingSite" class="px-4" />

      <CreateSiteResourceForm v-else-if="isAddingResource || updatingResource" class="px-4" />

      <template v-else>
        <SiteDetail @toggleSiteEdit="toggleSiteEdit" />
        <SiteResources />
      </template>
    </div>

    <div v-else class="flex flex-grow items-center justify-center">
      <p class="text-sm italic text-muted-foreground">Please select a site</p>
    </div>
  </LeftPanelWrapper>
</template>
