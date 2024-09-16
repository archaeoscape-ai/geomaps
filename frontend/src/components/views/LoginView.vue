<script setup>
import LoginForm from '@/components/authentication/LoginForm.vue'
import Button from '../ui/button/Button.vue';
</script>

<template>
  <div class="flex min-h-screen w-full items-center justify-center bg-red-500">
    <div class="flex flex-col items-center justify-center rounded-3xl bg-white p-11 gap-4">
      <h1 class="text-2xl font-bold">Welcome</h1>
      <p class="text-sm font-medium">Please sign in using your credentials</p>
      <LoginForm />
      <Button variant="link">Forget Password</Button>
    </div>
  </div>
</template>
