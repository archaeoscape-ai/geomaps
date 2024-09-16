<script setup>
import { useFormField } from "./useFormField";
import { Label } from "@/components/ui/label";

defineProps({
  for: { type: String, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: null, required: false },
  class: { type: null, required: false },
});

const { formItemId } = useFormField();
</script>

<template>
  <Label
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
