<script setup>
import { LayersIcon } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import NoteIcon from '@/assets/note-icon.svg?component'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import LogoIcon from '@/assets/logo-icon.svg?component'
import { RIGHT_PANELS } from '@/helpers/constants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

defineProps({
  isPanelActive: Boolean,
})

const rightPanelStore = useRightPanelStore()
const { openPanel } = rightPanelStore
</script>

<template>
  <div
    class="absolute right-4 top-4 transition-all"
    :class="{
      'translate-x-0': !isPanelActive,
      '-translate-x-96': isPanelActive,
    }"
  >
    <div class="flex flex-col gap-3">
      <Button size="icon" variant="secondary">
        <LogoIcon />
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" @click="openPanel(RIGHT_PANELS.LAYER)">
              <LayersIcon class="h-4.5 w-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Layers</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" @click="openPanel(RIGHT_PANELS.NOTE)">
              <NoteIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Notes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
