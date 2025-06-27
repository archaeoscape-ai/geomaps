<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/AuthStore'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import FormInputField from '@/components/ui/input/FormInputField.vue'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const { error, isLoggingIn } = storeToRefs(authStore)

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .min(1, { message: 'This field has to be filled.' })
      .email('This is not a valid email.'),
    password: z.string().min(1, { message: 'This field has to be filled' }),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  const { email, password } = values
  await authStore.login({ email, password })

  if (!error.value) {
    await router.push({
      name: 'home',
      params: { id: route.query.mapId },
      query: { ...route.query, mapId: undefined },
    })
    return
  }

  if (error.value?.status === 401) {
    form.setFieldError('email', error.value.response.data.detail)
  } else if (error.value?.status === 400) {
    for (const [fieldName, errorMessage] of Object.entries(error.value.response.data)) {
      form.setFieldError(fieldName, errorMessage)
    }
  }
})
</script>

<template>
  <form @submit="onSubmit" class="flex w-full flex-col gap-4 sm:w-80">
    <FormInputField name="email" label="Email Address" type="email" />
    <FormInputField name="password" label="Password" type="password" />

    <Button type="submit" class="mt-4 w-full" :disabled="isLoggingIn">Login</Button>
  </form>
</template>
