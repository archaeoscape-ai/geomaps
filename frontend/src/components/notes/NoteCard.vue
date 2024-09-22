<script setup>
const props = defineProps({
  note: {
    type: Object,
    required: true,
  },
})

function handleZoomInToNote() {

}

function handleEditNote() {

}

function handleDeleteNote() {
  
}
</script>

<template>
  <div
    class="flex flex-col justify-center gap-2 divide-y rounded-lg bg-primary-foreground bg-white px-4 py-2.5 shadow-sm"
  >
    <div class="flex flex-col gap-2">
      <h3 class="line-clamp-1 text-sm font-semibold">{{ props.note.title }}</h3>
      <p class="line-clamp-3 text-sm">{{ props.note.body }}</p>
    </div>
    <div class="flex items-center gap-2 pt-2">
      <Button size="icon" variant="secondary" class="bg-white" @click="handleZoomInToNote">
        <ZoomIn size="20" />
      </Button>
      <Button size="icon" variant="secondary" class="bg-white" @click="handleEditNote">
        <Pencil size="20" />
      </Button>
      <Button size="icon" variant="secondary" class="bg-white" @click="handleDeleteNote">
        <Trash class="stroke-primary" size="20" />
      </Button>
    </div>
  </div>
</template>
