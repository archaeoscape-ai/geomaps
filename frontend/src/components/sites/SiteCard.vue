<script setup>
import { storeToRefs } from 'pinia'
import { Card, CardContent } from '@/components/ui/card'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { useSiteStore } from '@/stores/SiteStore'
import { ChevronRight } from 'lucide-vue-next'
import { transform } from 'ol/proj'
import { LEFT_PANELS } from '@/helpers/constants'

const props = defineProps({
  site: { type: Object, required: true },
})

const leftPanelStore = useLeftPanelStore()

const siteStore = useSiteStore()
const { selectedSite } = storeToRefs(siteStore)

function handleCardClick() {
  selectedSite.value = props.site

  const siteMarker = transform(props.site.location.coordinates, 'EPSG:4326', 'EPSG:3857')

  siteStore.setSiteMarker(siteMarker)
  leftPanelStore.setTab(LEFT_PANELS.IDENTIFY)
}
</script>

<template>
  <Card
    :class="['cursor-pointer', selectedSite?.id === props.site.id ? 'border border-gray-400' : '']"
    @click="handleCardClick"
  >
    <CardContent class="p-2">
      <div class="flex w-full items-center justify-between">
        <p class="text-sm font-semibold">{{ site.id }}: {{ site.english_name }}</p>
        <ChevronRight class="stroke-button-icon" />
      </div>
    </CardContent>
  </Card>
</template>
