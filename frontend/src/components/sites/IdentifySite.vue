<script setup>
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useSiteStore } from '@/stores/SiteStore'
import { useMapStore } from '@/stores/MapStore'
import { useNoteStore } from '@/stores/NoteStore'
import Button from '@/components/ui/button/Button.vue'
import CreateSiteForm from '@/components/sites/CreateSiteForm.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SiteDetail from '@/components/sites/SiteDetail.vue'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import DeleteSiteDialog from './DeleteSiteDialog.vue'
import { Ban, Pencil, Trash } from 'lucide-vue-next'
import { transform } from 'ol/proj'

const mapStore = useMapStore()
const { measuringDistance } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { isAddingNote } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { selectedSite, isEditingSite } = storeToRefs(siteStore)

const heading = computed(() => {
  return isEditingSite.value ? 'Update Site' : 'Site Details'
})

function toggleSiteEdit() {
  isEditingSite.value = !isEditingSite.value
  const siteMarker = transform(selectedSite.value?.location?.coordinates, 'EPSG:4326', 'EPSG:3857')
  siteStore.setSiteMarker(siteMarker)
}

onBeforeUnmount(() => (isEditingSite.value = false))

watch(selectedSite, (newValue) => {
  if (newValue) {
    const siteMarker = transform(newValue?.location?.coordinates, 'EPSG:4326', 'EPSG:3857')
    siteStore.setSiteMarker(siteMarker)
  }
})
</script>

<template>
  <LeftPanelWrapper :header="heading">
    <template v-slot:header-actions v-if="selectedSite">
      <DeleteSiteDialog :site-id="selectedSite?.id">
        <Button size="icon" variant="secondary" class="hover:bg-white">
          <Trash class="stroke-primary" size="20" />
        </Button>
      </DeleteSiteDialog>
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
  </LeftPanelWrapper>

  <div class="flex flex-grow flex-col gap-4 overflow-auto" v-if="selectedSite">
    <CreateSiteForm v-if="isEditingSite" class="px-4" />
    <SiteDetail v-else />
  </div>

  <div v-else class="flex flex-grow items-center justify-center">
    <p class="text-sm italic text-muted-foreground">Please select a site</p>
  </div>
</template>
