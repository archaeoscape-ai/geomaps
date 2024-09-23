<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import Button from '@/components/ui/button/Button.vue'
import { Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  noteId: {
    type: Number,
    required: true,
  },
})

const open = ref(false)
const isLoading = ref(false)

async function confirm(event) {
  console.log(event, props.noteId)
  isLoading.value = true
  await new Promise((resolve) => setTimeout(() => resolve('Hello'), 1000))
  isLoading.value = false
  open.value = false
}
</script>

<template>
  <AlertDialog :open="open">
    <AlertDialogTrigger as-child @click="open = true">
      <slot></slot>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Note?</AlertDialogTitle>
        <AlertDialogDescription>Are you sure you want to remove this note? </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="open = false">Cancel</AlertDialogCancel>
        <AlertDialogAction @click="confirm" as-child>
          <Button :disabled="isLoading">
            <Loader2 v-show="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Delete
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
