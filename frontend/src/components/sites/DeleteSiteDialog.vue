<script setup>
import { ref } from 'vue'
import ConfirmationAlertDialog from '../ui/alert-dialog/ConfirmationAlertDialog.vue'
import { useSiteStore } from '@/stores/SiteStore'

const props = defineProps({
  siteId: { type: Number, required: false },
})

const open = ref(false)

const siteStore = useSiteStore()

async function confirm() {
  await siteStore.deleteSite(props.siteId)
  open.value = false
}

function cancelDeletion() {
  open.value = false
}

function tiggerDialog() {
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
    @tiggerDialog="tiggerDialog"
    :isLoading="false"
  >
    <slot />
  </ConfirmationAlertDialog>
</template>
