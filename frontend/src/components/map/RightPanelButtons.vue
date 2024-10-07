<script setup>
import { LayersIcon } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import NoteIcon from '@/assets/note-icon.svg?component'
import SaveIcon from '@/assets/save-icon.svg?component'
import { useRightPanelStore } from '@/stores/RightPanelStore'
import { RIGHT_PANELS } from '@/helpers/constants'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useMapLayerConfigStore } from '@/stores/MapLayerConfigStore'
import MainMenu from './MainMenu.vue'
import { useMapStore } from '@/stores/MapStore'
import { storeToRefs } from 'pinia'
import { useToast } from '../ui/toast'

defineProps({
  isPanelActive: Boolean,
})

const { toast } = useToast()

const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)

const rightPanelStore = useRightPanelStore()
const { openPanel } = rightPanelStore

const layerConfigStore = useMapLayerConfigStore()
const { updateLayerConfig } = layerConfigStore
const { hasLayerConfigChanged } = storeToRefs(layerConfigStore)

async function saveConfig() {
  await updateLayerConfig(currentMap.value.id)
  toast({ description: 'Layer config saved' })
}
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
      <MainMenu />

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

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button size="icon" :disabled="!hasLayerConfigChanged" @click="saveConfig">
              <SaveIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Save</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>

<style lang="postcss" scoped></style>
