<script setup>
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/SiteStore'
import Button from '@/components/ui/button/Button.vue'
import CreateSiteForm from '@/components/sites/CreateSiteForm.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SiteDetail from '@/components/sites/SiteDetail.vue'
import LeftPanelWrapper from '@/components/panels/LeftPanelWrapper.vue'
import DeleteSiteDialog from './DeleteSiteDialog.vue'
import { Trash } from 'lucide-vue-next'

const siteStore = useSiteStore()
const { selectedSite, isEditingSite } = storeToRefs(siteStore)

const heading = computed(() => {
  return isEditingSite.value ? 'Update Site' : 'Site Details'
})

function toggleSiteEdit() {
  isEditingSite.value = !isEditingSite.value
}

onBeforeUnmount(() => (isEditingSite.value = false))
</script>

<template>
  <LeftPanelWrapper :header="heading">
    <template v-slot:header-actions>
      <DeleteSiteDialog :site-id="selectedSite.id" v-if="selectedSite">
        <Button size="xs">
          <p>Delete</p>
        </Button>
      </DeleteSiteDialog>
      <Button @click="toggleSiteEdit" size="xs" v-if="selectedSite">
        <p>{{ isEditingSite ? 'Cancle' : 'Edit' }}</p>
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
