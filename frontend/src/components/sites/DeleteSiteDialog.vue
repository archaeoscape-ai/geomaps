<script setup>
import { ref } from 'vue'
import ConfirmationAlertDialog from '../ui/alert-dialog/ConfirmationAlertDialog.vue'
import { useSiteStore } from '@/stores/SiteStore'
import { useToast } from '@/components/ui/toast'

const props = defineProps({
  siteId: { type: Number, required: false },
})

const open = ref(false)
const { toast } = useToast()
const siteStore = useSiteStore()
const isLoading = ref(false)

async function confirm() {
  if (isLoading.value) return

  isLoading.value = true
  try {
    await siteStore.deleteSite(props.siteId)
    toast({ description: 'Site deleted!' })
  } catch (error) {
    toast({ description: 'Could not delete site!', variant: 'destructive' })
  } finally {
    open.value = false
    isLoading.value = false
  }
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
    title="Delete Site"
    description="Are you sure you want to remove this site"
    @cancel="cancelDeletion"
    @confirm="confirm"
    @triggerDialog="triggerDialog"
    :isLoading="isLoading"
  >
    <slot />
  </ConfirmationAlertDialog>
</template>
