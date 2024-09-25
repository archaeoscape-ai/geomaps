<script setup>
import { useSiteStore } from '@/stores/SiteStore'
import { storeToRefs } from 'pinia'

const siteStore = useSiteStore()
const { selectedSite } = storeToRefs(siteStore)
</script>

<template>
  <div class="text-sm">
    <div class="grid grid-cols-2 gap-3 bg-blue-100 px-4 py-2">
      <div class="font-semibold">Site Type</div>
      <div>{{ selectedSite.site_type_name }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-white px-4 py-2">
      <div class="font-semibold">English Name</div>
      <div>{{ selectedSite.english_name }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-blue-100 px-4 py-2">
      <div class="font-semibold">French Name</div>
      <div>{{ selectedSite.french_name }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-white px-4 py-2">
      <div class="font-semibold">Khmer Name</div>
      <div>{{ selectedSite.khmer_name }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-blue-100 px-4 py-2">
      <div class="font-semibold">Alternative Name</div>
      <div>{{ selectedSite.alternative_name }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-white px-4 py-2">
      <div class="font-semibold">Alternative Khmer Name</div>
      <div>{{ selectedSite.alternative_khmer_name }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-blue-100 px-4 py-2">
      <div class="font-semibold">Latitude</div>
      <div>{{ selectedSite.location.coordinates[1] }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-white px-4 py-2">
      <div class="font-semibold">Longitude</div>
      <div>{{ selectedSite.location.coordinates[0] }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-blue-100 px-4 py-2">
      <div class="font-semibold">Description Name</div>
      <div>{{ selectedSite.description }}</div>
    </div>

    <div class="grid grid-cols-2 gap-3 bg-white px-4 py-2">
      <div class="font-semibold">IK ID Starred</div>
      <div>{{ selectedSite.ik_id_starred ? 'Yes' : 'No' }}</div>
    </div>
  </div>
</template>
