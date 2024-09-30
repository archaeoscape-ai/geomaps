<script setup>
import { MapPin, NavigationIcon, Share2 } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import GpsIcon from '@/assets/gps-icon.svg?component'
import RulerIcon from '@/assets/ruler-icon.svg?component'
import SaveIcon from '@/assets/save-icon.svg?component'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import ShareDialog from './ShareDialog.vue'
import { DialogTrigger } from '@/components/ui/dialog'
import { useRouter } from 'vue-router'

defineProps({
  isPanelActive: Boolean,
})

const mapStore = useMapStore()
const { trackingLocation, measuringDistance } = storeToRefs(mapStore)

const leftPanelStore = useLeftPanelStore()
const { toggleMenu } = leftPanelStore

function reset() {
  measuringDistance.value = false
  // console.log("hello world")

}

const router = useRouter()
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
            <Button
              size="icon"
              @click="trackingLocation = !trackingLocation"
              :class="{
                'bg-primary-darker': trackingLocation,
              }"
            >
              <GpsIcon v-if="!trackingLocation" />
              <NavigationIcon v-else size="18" class="relative right-[1px] top-[1px]" />
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
            <Button
              size="icon"
              @click="measuringDistance = !measuringDistance"
              :class="{
                'bg-primary-darker': measuringDistance,
              }"
            >
              <RulerIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Measure</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- TODO: Share map -->
      <ShareDialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <DialogTrigger as-child>
                <Button size="icon" @click="reset">
                  <Share2 class="h-4.5 w-4.5" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Share</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ShareDialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" @click="router.push({ name: 'home', params: { id: 2 }, query: {what: 'what' }})">
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
