<script setup>
import { watch } from 'vue'
import { useSiteStore } from '@/stores/SiteStore'
import { storeToRefs } from 'pinia'
import { transform } from 'ol/proj'

const siteStore = useSiteStore()
const { selectedSite } = storeToRefs(siteStore)

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

watch(
  selectedSite,
  (newValue) => {
    if (newValue) {
      const siteMarker = transform(newValue?.location?.coordinates, 'EPSG:4326', 'EPSG:3857')
      siteStore.setSiteMarker(siteMarker)
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="text-sm">
    <div
      v-for="(field, index) in siteFields"
      :key="field.key"
      :class="index % 2 === 0 ? 'bg-gray-200' : 'bg-white'"
    >
      <div class="grid grid-cols-2 items-center gap-4 break-words px-4 py-2">
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
    </div>
  </div>
</template>
