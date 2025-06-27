<script setup>
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const props = defineProps({
  tooltipText: {
    type: String,
    required: true,
  },
  tooltipSide: {
    type: String,
    default: 'left',
  },
  size: {
    type: String,
    default: 'icon',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  buttonVariant: {
    type: String,
    default: 'secondary',
  },
  btnClass: String,
})

const emit = defineEmits(['onBtnClick'])
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button
          :size="size"
          :disabled="disabled"
          @click="emit('onBtnClick')"
          :variant="buttonVariant"
          :class="btnClass"
        >
          <slot />
        </Button>
      </TooltipTrigger>
      <TooltipContent :side="tooltipSide">
        <p>{{ tooltipText }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
