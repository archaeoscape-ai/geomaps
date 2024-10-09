<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Card, CardContent } from '@/components/ui/card'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { useSiteStore } from '@/stores/SiteStore'
import { ChevronRight } from 'lucide-vue-next'
import { LEFT_PANELS } from '@/helpers/constants'

const props = defineProps({
  site: { type: Object, required: true },
})

const leftPanelStore = useLeftPanelStore()

const siteStore = useSiteStore()
const { selectedSiteFeature, selectedSite, identifySiteSourceRef, selectSiteInteractionRef } =
  storeToRefs(siteStore)

function handleCardClick() {
  const selectedFeature = identifySiteSourceRef.value.source.getFeatureById(props.site.id)
  selectSiteInteractionRef.value.select.getFeatures().clear()
  selectSiteInteractionRef.value?.select?.getFeatures().push(selectedFeature)
  selectedSiteFeature.value = selectedFeature
  siteStore.centerSelectedSite()

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
