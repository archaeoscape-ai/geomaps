<script setup>
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/SiteStore'

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
</script>

<template>
  <div class="mx-4 rounded bg-white py-4 text-xs shadow-sm">
    <div v-for="(field, index) in siteFields" :key="field.key" class="px-4">
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
  </div>
</template>
