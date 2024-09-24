<script setup>
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { useSiteStore } from '@/stores/SiteStore'
import { ChevronRight } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'

const props = defineProps({
  site: { type: Object, required: true },
})

const leftPanelStore = useLeftPanelStore()
const { activePanel } = storeToRefs(leftPanelStore)

const siteStore = useSiteStore()
const { selectedSite } = storeToRefs(siteStore)

function handleCardClick() {
  selectedSite.value = props.site
  leftPanelStore.setTab(1)
}
</script>
<template>
  <Card class="cursor-pointer" @click="handleCardClick">
    <CardContent class="p-2">
      <div class="flex w-full items-center justify-between">
        <p class="font-semibold">{{ site.id }}:{{ site.english_name }}</p>
        <ChevronRight class="stroke-button-icon" />
      </div>
    </CardContent>
  </Card>
</template>
