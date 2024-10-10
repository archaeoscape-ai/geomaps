<script setup>
import * as z from 'zod'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'
import { useSiteStore } from '@/stores/SiteStore'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, onMounted, ref } from 'vue'
import { useSiteResourceStore } from '@/stores/SiteResourceStore'
import FormInputField from '@/components/ui/input/FormInputField.vue'
import FormTextareaField from '@/components/ui/textarea/FormTextareaField.vue'
import FormSelectField from '@/components/ui/select/FormSelectField.vue'
import DatePicker from '@/components/ui/date-picker/DatePicker.vue'
import { LEFT_PANELS } from '@/helpers/constants'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { parseDate } from '@internationalized/date'

const leftPanelStore = useLeftPanelStore()
const siteStore = useSiteStore()
const { selectedSite } = storeToRefs(siteStore)

const siteResourceStore = useSiteResourceStore()
const { siteResourceTypes, isAddingResource, individuals, updatingResource } =
  storeToRefs(siteResourceStore)

const isSubmitting = ref(false)
const { toast } = useToast()

onMounted(() => {
  siteResourceStore.getSiteResourceTypes()
  siteResourceStore.getIndividuals()
})

const formSchema = toTypedSchema(
  z.object({
    caption: z.string().min(1, { message: 'This field has to be filled' }),
    resource_type: z.string().min(1, { message: 'This field has to be filled' }),
    author: z.string().optional(),
    notes: z.string().optional(),
    resource_date: z.string().optional(),
    resource_file: z.instanceof(File).optional(),
  }),
)

const initialFormValues = computed(() => ({
  caption: updatingResource.value?.caption || '',
  author: updatingResource.value?.author?.toString() || '',
  resource_type: updatingResource.value?.resource_type?.toString() || '',
  resource_date: updatingResource.value?.resource_date?.toString() || '',
  notes: updatingResource.value?.notes || '',
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: initialFormValues.value,
})

const onSubmit = form.handleSubmit(async (values) => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    const formData = new FormData()
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        formData.append(key, value)
      }
    }
    if (updatingResource.value) {
      await siteResourceStore.updateSiteResource(updatingResource.value.id, formData)
    } else {
      await siteResourceStore.createSiteResource(selectedSite.value.id, formData)
    }
    toast({ description: 'Site resource saved!' })
    updatingResource.value = null
    isAddingResource.value = false
    leftPanelStore.setTab(LEFT_PANELS.IDENTIFY)
  } catch (error) {
    if (error.status === 400) {
      for (const [fieldName, errorMessage] of Object.entries(error.response.data)) {
        form.setFieldError(fieldName, errorMessage)
      }
    } else {
      toast({ description: 'Could not save site resource!', variant: 'destructive' })
    }
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <FormSelectField
        name="resource_type"
        label="Resource Type"
        :options="siteResourceTypes?.results"
      />
      <FormSelectField name="author" label="Author" :options="individuals?.results" />

      <FormInputField name="caption" label="Caption" />

      <FormInputField
        name="resource_file"
        label="Resource File"
        type="file"
        @file-change="(files) => form.setFieldValue('resource_file', files[0])"
      />

      <DatePicker
        name="resource_date"
        label="Resource Date"
        :model-value="parseDate(form.values.resource_date)"
        @update:model-value="(v) => form.setFieldValue('resource_date', v.toString())"
      />
      <FormTextareaField name="notes" label="Notes" />

      <Button type="submit" class="my-4 w-full" :disabled="isSubmitting">Save</Button>
    </form>
  </div>
</template>
