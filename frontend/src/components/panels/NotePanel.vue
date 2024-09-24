<script setup>
import Button from '@/components/ui/button/Button.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { X, Plus } from 'lucide-vue-next'
import NoteCard from '../notes/NoteCard.vue'
import { storeToRefs } from 'pinia'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import { onMounted, watch } from 'vue'

const noteStore = useNoteStore()
const { notes, isAddingNote, page, pageSize } = storeToRefs(noteStore)
const { resetNoteOverlay, getNotes, getNotesGeom } = noteStore

const rightPanelStore = useRightPanelStore()
const { activePanel } = storeToRefs(rightPanelStore)

function handleCreateNote() {
  if (isAddingNote.value) {
    resetNoteOverlay()
  } else {
    isAddingNote.value = true
  }
}

onMounted(() => {
  getNotes(1)
  getNotesGeom(1)
})

function handleFetchNotes({ currentPage, currentPageSize }) {
  page.value = currentPage
  pageSize.value = currentPageSize
  getNotes(1)
}

watch(notes, () => {
  console.log(notes.value)
})
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
        :variant="isAddingNote ? 'outline' : 'default'"
      >
        <p>{{ isAddingNote ? 'Click on the map to create note' : 'Create Note' }}</p>
        <X size="16" v-if="isAddingNote" />
        <Plus size="16" v-else />
      </Button>
    </div>
    <div class="flex flex-grow flex-col gap-4 overflow-auto p-4">
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
