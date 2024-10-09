<script setup>
import { storeToRefs } from 'pinia'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-vue-next'
import { useSiteStore } from '@/stores/SiteStore'

const leftPanelStore = useLeftPanelStore()
const { activePanel } = storeToRefs(leftPanelStore)

const siteStore = useSiteStore()
const { selectSiteInteractionRef } = storeToRefs(siteStore)

function handlePanelClose() {
  siteStore.resetSitePosition()
  activePanel.value = null
  selectSiteInteractionRef.value.select.getFeatures().clear()
}

defineProps({
  header: { type: String, required: true },
})
</script>

<template>
  <div class="mb-4 p-4 shadow">
    <div class="flex items-center justify-between">
      <h2 class="font-bold">{{ header }}</h2>
      <div class="flex gap-4">
        <slot name="header-actions" />
        <Button
          size="icon"
          variant="secondary"
          class="rounded-full bg-white"
          @click="handlePanelClose"
        >
          <X class="stroke-button-icon" />
        </Button>
      </div>
    </div>
  </div>

  <slot />
</template>
