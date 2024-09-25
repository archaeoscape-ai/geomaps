<script setup>
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { storeToRefs } from 'pinia'
import CreateSite from '@/components/sites/CreateSite.vue'
import IdentifySite from '@/components/sites/IdentifySite.vue'
import SitePanel from '@/components/panels/SitePanel.vue'
import { LEFT_PANELS } from '@/helpers/constants'

const leftPanelStore = useLeftPanelStore()
const { activePanel, tabs } = storeToRefs(leftPanelStore)

const componentMapping = {
  [LEFT_PANELS.CREATE]: CreateSite,
  [LEFT_PANELS.IDENTIFY]: IdentifySite,
  [LEFT_PANELS.LIST]: SitePanel,
}
</script>

<template>
  <div
    class="absolute z-10 h-full w-96 flex-col bg-[#F2F5F8] shadow-[0px_2px_8px_0px_#0000001F] transition-all"
    :class="{
      'translate-x-0': activePanel !== null,
      '-translate-x-full': activePanel === null,
    }"
  >
    <div class="flex h-full flex-col">
      <div class="flex items-center divide-x">
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          class="flex h-8 flex-grow items-center justify-center bg-primary text-center text-xs font-bold text-primary-foreground"
          @click="leftPanelStore.setTab(index)"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- panel content -->
      <component v-if="activePanel" :is="componentMapping[activePanel.id]" />
    </div>
  </div>
</template>
