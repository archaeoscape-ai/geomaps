<script setup>
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/SiteStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import IconTooltipButton from '@/components/ui/tooltip/IconTooltipButton.vue'
import { Pencil } from 'lucide-vue-next'
import { useMapStore } from '@/stores/MapStore'
import { useNoteStore } from '@/stores/NoteStore'

const mapStore = useMapStore()
const { measuringDistance } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { isDisplayingNoteCursor } = storeToRefs(noteStore)

const siteStore = useSiteStore()
const { selectedSite } = storeToRefs(siteStore)

const emit = defineEmits(['toggleSiteEdit'])

const siteFields = [
  { label: 'Site Type', key: 'site_type_name' },
  { label: 'English Name', key: 'english_name' },
  { label: 'French Name', key: 'french_name' },
  { label: 'Khmer Name', key: 'khmer_name' },
  { label: 'Alternative Name', key: 'alternative_name' },
  { label: 'Alternative Khmer Name', key: 'alternative_khmer_name' },
  { label: 'Latitude', key: 'location.coordinates[1]' },
  { label: 'Longitude', key: 'location.coordinates[0]' },
  { label: 'Description', key: 'description' },
  { label: 'IK ID Starred', key: 'ik_id_starred', isBoolean: true },
]

function getValue(site, key) {
  return key.split('.').reduce((o, i) => {
    if (o && i.includes('[')) {
      const [property, index] = i.split(/\[|\]/).filter(Boolean)
      return o[property] ? o[property][index] : undefined
    }
    return o ? o[i] : undefined
  }, site)
}
</script>

<template>
  <Card class="mx-4 text-xs">
    <CardHeader class="flex flex-row items-center justify-between p-4">
      <CardTitle class="text-sm font-bold">Summary</CardTitle>
      <IconTooltipButton
        tooltipText="Edit"
        tooltipSide="bottom"
        @onBtnClick="emit('toggleSiteEdit')"
        :disabled="measuringDistance || isDisplayingNoteCursor"
        btnClass="bg-white"
      >
        <Pencil size="20" />
      </IconTooltipButton>
    </CardHeader>
    <CardContent class="flex flex-col px-4">
      <div v-for="(field, index) in siteFields" :key="field.key">
        <div class="grid grid-cols-2 items-center gap-2 break-words py-2">
          <div class="font-semibold">{{ field.label }}</div>
          <div>
            <template v-if="field.isBoolean">
              {{ getValue(selectedSite, field.key) ? 'Yes' : 'No' }}
            </template>
            <template v-else>
              {{ getValue(selectedSite, field.key) }}
            </template>
          </div>
        </div>
        <hr v-if="index !== siteFields.length - 1" />
      </div>
    </CardContent>
  </Card>
</template>
