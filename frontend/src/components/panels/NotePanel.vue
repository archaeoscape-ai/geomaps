<script setup>
import Button from '@/components/ui/button/Button.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { X } from 'lucide-vue-next'
import NoteCard from '../notes/NoteCard.vue'
import { storeToRefs } from 'pinia'

const noteStore = useNoteStore()
const { notes } = storeToRefs(noteStore)
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between p-4">
      <h2 class="font-bold">Map Notes</h2>
      <Button size="icon" variant="secondary" class="rounded-full bg-white">
        <X class="stroke-button-icon" />
      </Button>
    </div>
    <div class="px-4">
      <Button class="w-full">Create Note</Button>
    </div>
    <div class="flex flex-grow flex-col gap-4 overflow-auto p-4">
      <NoteCard :note="note" v-for="note in notes.results" :key="note.id" />
    </div>
    <div class="flex justify-center p-3">
      <Pagination :totalRecords="10" :page="1" :pageSize="5" />
    </div>
  </div>
</template>
