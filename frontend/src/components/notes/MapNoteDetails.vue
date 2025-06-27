<script setup>
import { useNoteStore } from '@/stores/NoteStore'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { Pencil, Trash } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import DeleteNoteDialog from './DeleteNoteDialog.vue'
import { useAuthStore } from '@/stores/AuthStore'

const noteStore = useNoteStore()
const { selectedNoteDetail, isEditingNote } = storeToRefs(noteStore)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

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

const canEditNote = computed(() => {
  return user.value.id === selectedNoteDetail?.value.created_by || user.value.is_admin
})
</script>

<template>
  <div class="flex max-w-[300px] flex-col gap-2" v-if="selectedNoteDetail">
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
        <Button
          size="icon"
          variant="secondary"
          class="bg-white"
          @click="handleEditNote"
          v-if="canEditNote"
        >
          <Pencil size="20" />
        </Button>
        <DeleteNoteDialog
          :note-id="selectedNoteDetail?.id"
          v-if="canEditNote"
        >
          <Button size="icon" variant="secondary" class="bg-white">
            <Trash class="stroke-primary" size="20" />
          </Button>
        </DeleteNoteDialog>
      </div>
    </div>
  </div>
</template>
