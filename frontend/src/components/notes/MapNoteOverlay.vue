<script setup>
import { storeToRefs } from 'pinia'
import { useNoteStore } from '@/stores/NoteStore'
import CreateMapNote from './CreateMapNote.vue'
import MapNoteDetails from './MapNoteDetails.vue'

const noteStore = useNoteStore()
const { selectedNote, isCreatingNote, isEditingNote } = storeToRefs(noteStore)
</script>

<template>
  <div class="p-2 sm:p-4 text-sm" ref="container">
    <CreateMapNote
      v-if="isEditingNote || isCreatingNote"
      :note="selectedNote"
      :isCreatingNote="isCreatingNote"
    />
    <MapNoteDetails v-else :note="selectedNote" />
  </div>
</template>
