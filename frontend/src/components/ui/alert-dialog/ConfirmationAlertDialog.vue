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
import { Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isLoading: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel', 'tiggerDialog'])
</script>

<template>
  <AlertDialog :open="open">
    <AlertDialogTrigger as-child @click="emit('tiggerDialog')">
      <slot></slot>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title }}?</AlertDialogTitle>
        <AlertDialogDescription>{{ description }}? </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="emit('cancel')">Cancel</AlertDialogCancel>
        <AlertDialogAction @click="emit('confirm')" as-child>
          <Button :disabled="isLoading">
            <Loader2 v-show="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Delete
          </Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
