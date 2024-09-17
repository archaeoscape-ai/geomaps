<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/authentication/LoginForm.vue'
import Button from '@/components/ui/button/Button.vue'
import fullLogo from '@/assets/full-logo.png'
import backgroundImage from '@/assets/background-image.png'

const backgroundImageUrl = ref(`url(${backgroundImage})`)
</script>

<template>
  <div class="background-img flex flex-col min-h-screen w-full">
    <div class="flex justify-center items-center flex-grow">
      <div class="flex flex-col items-center bg-white p-11 rounded-3xl gap-4">
        <img :src="fullLogo" alt="logo" class="w-72" />
        <h1 class="text-2xl font-bold">Welcome</h1>
        <p class="text-sm font-medium mb-7">Please sign in using your credentials</p>
        <LoginForm />
        <Button variant="link">Forget Password</Button>
      </div>
    </div>
    <div class="text-primary-foreground px-8 py-5 flex justify-between items-center text-xs">
      <p>Copyright © 2024 archaeoscape. All Rights Reserved.</p>
      <div class="flex items-center gap-4 underline">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & Conditions</a>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.background-img {
  background-image: v-bind(backgroundImageUrl);
  background-size: cover;
}
</style>
