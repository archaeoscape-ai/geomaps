<script setup>
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { useSiteStore } from '@/stores/SiteStore'
import Button from '@/components/ui/button/Button.vue'
import { X } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const leftPanelStore = useLeftPanelStore()
const { activePanel, tabs } = storeToRefs(leftPanelStore)

const siteStore = useSiteStore()
const { selectedSite } = storeToRefs(siteStore)
</script>

<template>
  <div class="p-4">
    <div class="flex items-center justify-between">
      <h2 class="font-bold">Sites</h2>
      <div class="flex gap-4">
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
  </div>
  <h1>site details</h1>
</template>
