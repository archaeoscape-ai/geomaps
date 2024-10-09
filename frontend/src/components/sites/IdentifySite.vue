<script setup>
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, watch } from 'vue'
import { useSiteStore } from '@/stores/SiteStore'
import { useMapStore } from '@/stores/MapStore'
import { useNoteStore } from '@/stores/NoteStore'
import { useSiteResourceStore } from '@/stores/SiteResourceStore'
import Button from '@/components/ui/button/Button.vue'
import CreateSiteForm from '@/components/sites/CreateSiteForm.vue'
import CreateSiteResourceForm from '@/components/sites/resources/CreateSiteResourceForm.vue'
import SiteDetail from '@/components/sites/SiteDetail.vue'
import SiteResources from '@/components/sites/resources/SiteResources.vue'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import DeleteSiteDialog from './DeleteSiteDialog.vue'
import { Ban, Pencil, Trash, Files, ArrowLeft } from 'lucide-vue-next'

const mapStore = useMapStore()
const { measuringDistance } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { isAddingNote } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { selectedSite, isEditingSite } = storeToRefs(siteStore)

const siteResourceStore = useSiteResourceStore()
const { isAddingResource, siteResources, updatingResource } = storeToRefs(siteResourceStore)

const heading = computed(() => {
  return isAddingResource.value
    ? 'Add resource'
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

function addResources() {
  isEditingSite.value = false
  isAddingResource.value = true
}

function cancelAddResource() {
  isAddingResource.value = false
  updatingResource.value = null
}

onBeforeUnmount(() => {
  isEditingSite.value = false
  isAddingResource.value = false
})

watch(
  selectedSite,
  async (newSite) => {
    if (newSite) {
      isAddingResource.value = false
      await siteResourceStore.getSiteResources(newSite.id)
    }
  },
  { immediate: true },
)
</script>

<template>
  <LeftPanelWrapper :header="heading">
    <template v-slot:header-actions v-if="selectedSite">
      <template v-if="!isAddingResource && !updatingResource">
        <DeleteSiteDialog :site-id="selectedSite?.id">
          <Button size="icon" variant="secondary" class="hover:bg-white">
            <Trash class="stroke-primary" size="20" />
          </Button>
        </DeleteSiteDialog>
        <Button @click="addResources" size="icon" variant="secondary" class="hover:bg-white">
          <Files size="20" />
        </Button>
        <Button
          @click="toggleSiteEdit"
          size="icon"
          variant="secondary"
          class="hover:bg-white"
          :disabled="measuringDistance || isAddingNote"
        >
          <Ban size="20" v-if="isEditingSite" />
          <Pencil size="20" v-else />
        </Button>
      </template>
      <template v-else>
        <Button @click="cancelAddResource" size="icon" variant="secondary" class="hover:bg-white">
          <ArrowLeft size="20" />
        </Button>
      </template>
    </template>

    <div class="flex flex-grow flex-col gap-4 overflow-auto" v-if="selectedSite">
      <CreateSiteForm v-if="isEditingSite" class="px-4" />

      <CreateSiteResourceForm v-else-if="isAddingResource || updatingResource" class="px-4" />

      <template v-else>
        <SiteDetail />
        <SiteResources v-if="siteResources?.results.length > 0" />
      </template>
    </div>

    <div v-else class="flex flex-grow items-center justify-center">
      <p class="text-sm italic text-muted-foreground">Please select a site</p>
    </div>
  </LeftPanelWrapper>
</template>
