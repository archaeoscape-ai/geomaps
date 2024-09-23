<script setup>
import { useNoteStore } from '@/stores/NoteStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Pencil, Trash } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import DeleteNoteDialog from './DeleteNoteDialog.vue'

const noteStore = useNoteStore()
const { selectedNoteDetail, isEditingNote } = storeToRefs(noteStore)

const initials = computed(() => {
  if (!selectedNoteDetail.value) return
  const allNames = selectedNoteDetail.value.owner_name.trim().split(' ')
  const results = allNames.reduce((acc, curr, index) => {
    if (index === 0 || index === allNames.length - 1) {
      acc = `${acc}${curr.charAt(0).toUpperCase()}`
    }
    return acc
  }, '')
  return results
})

function handleEditNote() {
  isEditingNote.value = true
}
</script>

<template>
  <div class="flex flex-col gap-2" v-if="selectedNoteDetail">
    <h3 class="line-clamp-1 text-sm font-semibold">{{ selectedNoteDetail?.title }}</h3>
    <p class="line-clamp-3 text-sm">{{ selectedNoteDetail?.body }}</p>
    <div class="flex items-center justify-between">
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
        <p class="text-xs font-semibold">{{ selectedNoteDetail?.owner_name }}</p>
      </div>
      <div class="flex items-center gap-2">
        <Button size="icon" variant="secondary" class="bg-white" @click="handleEditNote">
          <Pencil size="20" />
        </Button>
        <DeleteNoteDialog :note-id="selectedNoteDetail?.id">
          <Button size="icon" variant="secondary" class="bg-white">
            <Trash class="stroke-primary" size="20" />
          </Button>
        </DeleteNoteDialog>
      </div>
    </div>
  </div>
</template>
