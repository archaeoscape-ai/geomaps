import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRightPanelStore = defineStore('right-panel', () => {
  const activePanel = ref(null)

  function openPanel(panel) {
    if (panel === null || panel === activePanel.value) {
      activePanel.value = null
    } else {
      activePanel.value = panel
    }
  }

  return {
    activePanel,
    openPanel,
  }
})
