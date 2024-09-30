<script setup>
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useMapStore } from '@/stores/MapStore'
import { useClipboard } from '@vueuse/core'
import { transform } from 'ol/proj'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { Copy, CopyCheck } from 'lucide-vue-next'

const open = ref(false)

const { copy, copied } = useClipboard()
const mapStore = useMapStore()
const { mapRef, currentMap } = storeToRefs(mapStore)

const sharedUrl = ref('')

function setSharedUrl() {
  if (!mapRef.value || !currentMap.value) return

  const baseUrl = window.location.origin
  const url = new URL(currentMap.value.id, baseUrl)
  const [lng, lat] = transform(mapRef.value.map.getView().getCenter(), 'EPSG:3857', 'EPSG:4326')

  url.searchParams.append('zoom', mapRef.value.map.getView().getZoom())
  url.searchParams.append('lat', lat)
  url.searchParams.append('lng', lng)

  sharedUrl.value = url.toString()
}

function shareLink() {
  copy(sharedUrl.value)
}

watch(open, () => {
  if (open.value) {
    setSharedUrl()
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <slot></slot>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share Map</DialogTitle>
        <DialogDescription>Copy the link above to share the map</DialogDescription>
      </DialogHeader>
      <div class="flex items-center gap-4">
        <Input class="flex-grow" type="text" readonly v-model="sharedUrl" />
        <Button type="submit" class="bg-white" size="icon" variant="secondary" @click="shareLink">
          <span className="sr-only">Copy</span>
          <Copy className="h-4 w-4" v-if="!copied" />
          <CopyCheck className="h-4 w-4" v-else />
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
