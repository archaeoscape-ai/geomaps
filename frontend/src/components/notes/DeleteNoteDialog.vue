<script setup>
import { useMapStore } from '@/stores/MapStore'
import { useNoteStore } from '@/stores/NoteStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import ConfirmationAlertDialog from '../ui/alert-dialog/ConfirmationAlertDialog.vue'

const props = defineProps({
  noteId: {
    type: Number,
    required: true,
  },
})

const open = ref(false)

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { isLoading } = storeToRefs(noteStore)
const { deleteNote } = noteStore

async function confirm() {
  await deleteNote(currentMap.value.id, props.noteId)
  open.value = false
}

function cancelDeletion() {
  open.value = false
}

function triggerDialog() {
  open.value = true
}
</script>

<template>
  <ConfirmationAlertDialog
    :open="open"
    title="Delete Note"
    description="Are you sure you want to remove this note"
    @cancel="cancelDeletion"
    @confirm="confirm"
    @triggerDialog="triggerDialog"
    :isLoading="isLoading"
  >
    <slot />
  </ConfirmationAlertDialog>
</template>
