<script setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { useNoteStore } from '@/stores/NoteStore'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/stores/MapStore'
import FormInputField from '../ui/input/FormInputField.vue'
import FormTextareaField from '../ui/textarea/FormTextareaField.vue'

const noteStore = useNoteStore()
const { addNote, updateNote } = noteStore
const { selectedNote, selectedNoteDetail, isCreatingNote } = storeToRefs(noteStore)

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(1, { message: 'This field has to be filled.' }),
    body: z.string().min(1, { message: 'This field has to be filled.' }),
  }),
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: selectedNoteDetail.value?.title,
    body: selectedNoteDetail.value?.body,
  },
})

const onSubmit = form.handleSubmit(async (values) => {
  const data = {
    ...values,
    geom: selectedNote.value.geom,
  }

  if (isCreatingNote.value) {
    await addNote(currentMap.value.id, data)
  } else {
    await updateNote(currentMap.value.id, selectedNote.value.id, data)
  }
})

watch(selectedNoteDetail, () => {
  form.setFieldValue('title', selectedNoteDetail.value?.title)
  form.setFieldValue('body', selectedNoteDetail.value?.body)
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <h3 class="text-base font-bold">{{ isCreatingNote ? 'Create Note' : 'Update Note' }}</h3>
    <form @submit="onSubmit" class="flex w-80 flex-col gap-4">
      <FormInputField name="title" label="Note Title" />
      <FormTextareaField name="body" label="Note Body" />
      <Button type="submit" class="mt-4 w-full">Save</Button>
    </form>
  </div>
</template>
