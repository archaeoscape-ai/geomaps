<script setup>
import { ref } from 'vue'
import ConfirmationAlertDialog from '@/components/ui/alert-dialog/ConfirmationAlertDialog.vue'
import { useToast } from '@/components/ui/toast'
import { useSiteResourceStore } from '@/stores/SiteResourceStore'

const props = defineProps({
  siteResourceId: { type: Number, required: false },
})

const open = ref(false)
const { toast } = useToast()
const siteResourceStore = useSiteResourceStore()
const isLoading = ref(false)

async function confirm() {
  if (isLoading.value) return

  isLoading.value = true
  try {
    await siteResourceStore.deleteSiteResource(props.siteResourceId)
    toast({ description: 'Site resource deleted!' })
  } catch (error) {
    toast({ description: 'Could not delete site resource!', variant: 'destructive' })
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
    title="Delete Site Resource"
    description="Are you sure you want to remove this site resource"
    @cancel="cancelDeletion"
    @confirm="confirm"
    @triggerDialog="triggerDialog"
    :isLoading="isLoading"
  >
    <slot />
  </ConfirmationAlertDialog>
</template>
