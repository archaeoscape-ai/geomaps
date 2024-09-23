<script setup>
import { storeToRefs } from 'pinia'
import { useNoteStore } from '@/stores/NoteStore'
import CreateMapNote from './CreateMapNote.vue'
import MapNoteDetails from './MapNoteDetails.vue'
import { watch } from 'vue'

const noteStore = useNoteStore()
const { selectedNote, isCreatingNote, isEditingNote } = storeToRefs(noteStore)

watch(selectedNote, (note) => {
  if (note) {
    console.log('load note detail')
  }
})
</script>

<template>
  <div class="p-2 text-sm sm:p-4 min-w-[300px] max-w-md" ref="container">
    <CreateMapNote
      v-if="isEditingNote || isCreatingNote"
      :note="selectedNote"
      :isCreatingNote="isCreatingNote"
    />
    <MapNoteDetails v-else :note="selectedNote" />
  </div>
</template>
