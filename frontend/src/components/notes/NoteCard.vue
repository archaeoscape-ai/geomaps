<script setup>
import { Pencil, Trash, ZoomIn } from 'lucide-vue-next'
import Button from '../ui/button/Button.vue'
import { useNoteStore } from '@/stores/NoteStore'
import DeleteNoteDialog from './DeleteNoteDialog.vue'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const props = defineProps({
  note: {
    type: Object,
    required: true,
  },
})

const noteStore = useNoteStore()
const { isEditingNote } = storeToRefs(noteStore)
const { zoomInNote } = noteStore

const initials = computed(() => {
  const allNames = props.note.owner_name.trim().split(' ')
  const results = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`
    }
    return acc
  }, '')
  return results
})

function handleZoomInNote() {
  zoomInNote(props.note)
}

function handleEditNote() {
  zoomInNote(props.note)
  isEditingNote.value = true
}
</script>

<template>
  <div
    class="flex flex-col justify-center gap-2 divide-y rounded-lg bg-primary-foreground bg-white px-4 py-2.5 shadow-sm"
  >
    <div class="flex flex-col gap-2">
      <h3 class="line-clamp-1 text-sm font-semibold">{{ props.note.title }}</h3>
      <p class="line-clamp-3 text-sm">{{ props.note.body }}</p>
    </div>
    <div class="flex items-center justify-between pt-2">
      <div class="flex items-center gap-2">
        <div
          class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white"
          :class="{
            'bg-black': true,
            'bg-text-blue': false,
          }"
        >
          {{ initials }}
        </div>
        <p class="text-xs font-semibold">{{ props.note.owner_name }}</p>
      </div>
      <div class="flex items-center gap-2">
        <Button size="icon" variant="secondary" class="bg-white" @click="handleZoomInNote">
          <ZoomIn size="20" />
        </Button>
        <Button size="icon" variant="secondary" class="bg-white" @click="handleEditNote">
          <Pencil size="20" />
        </Button>
        <DeleteNoteDialog :note-id="props.note.id">
          <Button size="icon" variant="secondary" class="bg-white">
            <Trash class="stroke-primary" size="20" />
          </Button>
        </DeleteNoteDialog>
      </div>
    </div>
  </div>
</template>
