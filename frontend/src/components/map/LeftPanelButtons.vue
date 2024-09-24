<script setup>
import { MapPin, Share2 } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import GpsIcon from '@/assets/gps-icon.svg?component'
import RulerIcon from '@/assets/ruler-icon.svg?component'
import SaveIcon from '@/assets/save-icon.svg?component'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

defineProps({
  isPanelActive: Boolean,
})

const leftPanelStore = useLeftPanelStore()
const { toggleMenu } = leftPanelStore
</script>

<template>
  <div
    class="absolute left-4 top-4 transition-all"
    :class="{
      'translate-x-0': !isPanelActive,
      'translate-x-96': isPanelActive,
    }"
  >
    <div class="flex flex-col gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" @click="toggleMenu">
              <MapPin class="h-4.5 w-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Sites</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <!-- TODO: Get current user location and add a pin -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon">
              <GpsIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>GPS</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- TODO: Distance -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon">
              <RulerIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Measure</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- TODO: Share map -->
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon">
              <Share2 class="h-4.5 w-4.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Share</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon">
              <SaveIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Save</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
