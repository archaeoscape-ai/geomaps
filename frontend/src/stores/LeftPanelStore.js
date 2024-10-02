import { LEFT_PANELS } from '@/helpers/constants'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLeftPanelStore = defineStore('left-panel', () => {
  const activePanel = ref(null)

  const tabs = computed(() => [
    {
      id: LEFT_PANELS.LIST,
      name: 'Sites',
    },
    {
      id: LEFT_PANELS.IDENTIFY,
      name: 'Identify/Edit',
    },
    {
      id: LEFT_PANELS.CREATE,
      name: 'Create',
    },
  ])

  function toggleMenu() {
    if (activePanel.value === null) {
      activePanel.value = tabs.value[0]
    } else {
      activePanel.value = null
    }
  }

  function setTab(id) {
    activePanel.value = tabs.value.find(tab => tab.id === id)
  }

  return {
    tabs,
    activePanel,

    toggleMenu,
    setTab,
  }
})
