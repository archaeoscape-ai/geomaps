<script setup>
import Button from '@/components/ui/button/Button.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import { useNoteStore } from '@/stores/NoteStore'
import { Pencil, Trash, ZoomIn, X } from 'lucide-vue-next'
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
      <div
        class="flex flex-col justify-center gap-2 divide-y rounded-lg bg-primary-foreground bg-white px-4 py-2.5 shadow-sm"
        v-for="note in notes.results"
        :key="note.id"
      >
        <div class="flex flex-col gap-2">
          <h3 class="line-clamp-1 text-sm font-semibold">{{ note.title }}</h3>
          <p class="line-clamp-3 text-sm">{{ note.body }}</p>
        </div>
        <div class="flex items-center gap-2 pt-2">
          <Button size="icon" variant="secondary" class="bg-white">
            <ZoomIn size="20" />
          </Button>
          <Button size="icon" variant="secondary" class="bg-white">
            <Pencil size="20" />
          </Button>
          <Button size="icon" variant="secondary" class="bg-white">
            <Trash class="stroke-primary" size="20" />
          </Button>
        </div>
      </div>
    </div>
    <div class="flex justify-center p-3">
      <Pagination :totalRecords="10" :page="1" :pageSize="5" />
    </div>
  </div>
</template>
