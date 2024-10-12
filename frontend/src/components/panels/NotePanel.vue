<script setup>
import Button from '@/components/ui/button/Button.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { X, Plus } from 'lucide-vue-next'
import NoteCard from '../notes/NoteCard.vue'
import { storeToRefs } from 'pinia'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import { onMounted } from 'vue'
import { useMapStore } from '@/stores/MapStore'
import { useSiteStore } from '@/stores/SiteStore'

const mapStore = useMapStore()
const { currentMap, measuringDistance } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { notes, isDisplayingNoteCursor, page, pageSize } = storeToRefs(noteStore)
const { resetNoteOverlay, getNotes, getNotesGeom } = noteStore

const siteStore = useSiteStore()
const { isCreatingSite, isEditingSite } = storeToRefs(siteStore)

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

function handleCreateNote() {
  if (isDisplayingNoteCursor.value) {
    resetNoteOverlay()
  } else {
    isDisplayingNoteCursor.value = true
  }
}

onMounted(() => {
  getNotes(currentMap.value.id)
  getNotesGeom(currentMap.value.id)
})

function handleFetchNotes({ currentPage, currentPageSize }) {
  page.value = currentPage
  pageSize.value = currentPageSize
  getNotes(currentMap.value.id)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between p-4">
      <h2 class="font-bold">Map Notes</h2>
      <Button
        size="icon"
        variant="secondary"
        class="rounded-full bg-white"
        @click="activePanel = null"
      >
        <X class="stroke-button-icon" />
      </Button>
    </div>
    <div class="px-4">
      <Button
        class="flex w-full items-center gap-1"
        @click="handleCreateNote"
        :variant="isDisplayingNoteCursor ? 'outline' : 'default'"
        :disabled="isCreatingSite || isEditingSite || measuringDistance"
      >
        <p>{{ isDisplayingNoteCursor ? 'Click on the map to create note' : 'Create Note' }}</p>
        <X size="16" v-if="isDisplayingNoteCursor" />
        <Plus size="16" v-else />
      </Button>
    </div>
    <div class="flex flex-grow flex-col gap-4 overflow-auto p-4 pt-0 mt-4">
      <NoteCard :note="note" v-for="note in notes?.results" :key="note.id" />
    </div>
    <div class="flex justify-center p-3">
      <Pagination
        :totalRecords="notes?.count || 0"
        :page="page"
        :pageSize="pageSize"
        @fetchData="handleFetchNotes"
      />
    </div>
  </div>
</template>
