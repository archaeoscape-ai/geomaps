import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useLeftPanelStore = defineStore('left-panel', () => {
  const activePanel = ref(null)

  const tabs = computed(() => [
    {
      id: 'sites',
      name: 'Sites',
    },
    {
      id: 'identify',
      name: 'Identify/Edit',
    },
    {
      id: 'create',
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

  function setTab(tabIndex) {
    activePanel.value = tabs.value[tabIndex]
  }

  return {
    tabs,
    activePanel,

    toggleMenu,
    setTab,
  }
})
