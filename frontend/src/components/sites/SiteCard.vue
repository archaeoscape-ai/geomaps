<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Card, CardContent } from '@/components/ui/card'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { useSiteStore } from '@/stores/SiteStore'
import { ChevronRight } from 'lucide-vue-next'
import { LEFT_PANELS } from '@/helpers/constants'
import { useMapStore } from '@/stores/MapStore'

const props = defineProps({
  site: { type: Object, required: true },
})

const mapStore = useMapStore()
const { mapRef } = storeToRefs(mapStore)

const leftPanelStore = useLeftPanelStore()

const siteStore = useSiteStore()
const { selectedSiteFeature, selectedSite } = storeToRefs(siteStore)

async function handleCardClick() {
  const feature = siteStore.createFeatureFromSite(props.site)

  const mapView = mapRef.value.map.getView()
  mapView.fit(feature.getGeometry().getExtent(), {
    padding: [200, 200, 200, 200],
    maxZoom: 14,
    duration: 1000,
  })

  selectedSiteFeature.value = feature
  leftPanelStore.setTab(LEFT_PANELS.IDENTIFY)
}

const activeSite = computed(() => selectedSite.value?.id === props.site.id)
</script>

<template>
  <Card
    :class="['cursor-pointer', activeSite ? 'bg-primary text-white' : '']"
    @click="handleCardClick"
  >
    <CardContent class="p-2">
      <div class="flex w-full items-center justify-between break-words">
        <p class="w-full text-sm font-semibold">{{ site.id }}: {{ site.english_name }}</p>
        <ChevronRight :class="[activeSite ? 'text-white' : 'stroke-button-icon']" />
      </div>
    </CardContent>
  </Card>
</template>
