<script setup>
import Button from '@/components/ui/button/Button.vue'
import Pagination from '@/components/ui/pagination/Pagination.vue'
import { X } from 'lucide-vue-next'
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex flex-grow items-center justify-between p-4">
      <h2 class="font-bold">Map Notes</h2>
      <Button size="icon" variant="secondary" class="rounded-full bg-white">
        <X />
      </Button>
    </div>
    <div class="px-4">
      <Button class="w-full">Create Note</Button>
    </div>
    <div class="flex flex-grow flex-col gap-4 overflow-auto p-4">
      <div
        class="flex flex-col justify-center gap-2 bg-primary-foreground px-4 py-2.5 rounded-lg shadow-sm"
        v-for="i in new Array(10).fill(1)"
      >
        <h3 class="text-sm font-semibold">Note title</h3>
        <p class="text-sm">Note description</p>
        <div>
          <Button size="icon" variant="secondary" class="rounded-full bg-white">
            <X />
          </Button>
        </div>
      </div>
    </div>
    <div class="flex justify-center p-3">
      <Pagination :totalRecords="10" :page="1" :pageSize="5" />
    </div>
  </div>
</template>
