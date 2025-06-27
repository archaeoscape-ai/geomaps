<script setup>
import { storeToRefs } from 'pinia'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import CreateSite from '@/components/sites/CreateSite.vue'
import IdentifySite from '@/components/sites/IdentifySite.vue'
import SiteList from '@/components/panels/SiteList.vue'
import { LEFT_PANELS } from '@/helpers/constants'
import { useNoteStore } from '@/stores/NoteStore'
import { useMapStore } from '@/stores/MapStore'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
const { isReadOnly } = storeToRefs(authStore)

const leftPanelStore = useLeftPanelStore()
const { activePanel, tabs } = storeToRefs(leftPanelStore)

const mapStore = useMapStore()
const { measuringDistance } = storeToRefs(mapStore)

const noteStore = useNoteStore()
const { isDisplayingNoteCursor } = storeToRefs(noteStore)

const componentMapping = {
  [LEFT_PANELS.CREATE]: CreateSite,
  [LEFT_PANELS.IDENTIFY]: IdentifySite,
  [LEFT_PANELS.LIST]: SiteList,
}

function shouldDisable(id) {
  return id === LEFT_PANELS.CREATE && (isDisplayingNoteCursor.value || measuringDistance.value)
}
</script>

<template>
  <div
    class="absolute z-10 h-full w-full flex-col bg-[#F2F5F8] shadow-[0px_2px_8px_0px_#0000001F] transition-all sm:w-96"
    :class="{
      'translate-x-0': activePanel !== null,
      '-translate-x-full': activePanel === null,
    }"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center divide-x">
        <template v-for="tab in tabs" :key="tab.id">
          <button
            v-if="!isReadOnly || tab.id !== LEFT_PANELS.CREATE"
            class="flex h-8 flex-grow basis-0 items-center justify-center text-center text-sm font-bold text-primary-foreground"
            @click="leftPanelStore.setTab(tab.id)"
            :class="{
              'bg-primary-darker': activePanel?.id === tab.id,
              'bg-primary': activePanel?.id !== tab.id,
              'opacity-70': shouldDisable(tab.id),
            }"
            :disabled="shouldDisable(tab.id)"
          >
            {{ tab.name }}
          </button>
        </template>
      </div>

      <!-- panel content -->
      <component v-if="activePanel" :is="componentMapping[activePanel.id]" />
    </div>
  </div>
</template>
