import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const mockData = {
  count: 1,
  next: null,
  previous: null,
  results: [
    {
      id: 261,
      geom: {
        type: 'Point',
        coordinates: [-8227603.583055657, 5724317.703220517],
      },
      title: 'test',
      body: 'test',
      map: 536,
      owner_name: 'CS Admin',
      created_by: 75,
      created_on: '2024-09-19T20:49:45.894061Z',
      updated_on: '2024-09-19T20:49:45.894091Z',
      is_shared: false,
    },
  ],
}

const mockDataGeom = [
  {
    id: 261,
    geom: {
      type: 'Point',
      coordinates: [-8227603.583055657, 5724317.703220517],
    },
    is_shared: false,
  },
]

export const useNoteStore = defineStore('note', () => {
  const notes = ref(mockData)
  const notesGeom = ref(mockDataGeom)
  const selectedNote = ref(null)
  const selectedNoteDetail = ref(null)
  const isLoading = ref(false)

  // Click on Add New Note
  const isAddingNote = ref(false)

  // Editing an existing node
  const isEditingNote = ref(false)

  // After clicking Add New Note and show overlay
  const isCreatingNote = computed(() => {
    return selectedNote.value?.id === 'new-note'
  })

  const displayedNotes = computed(() => {
    if (!selectedNote.value || !isCreatingNote.value) return notesGeom.value
    return [...notesGeom.value, selectedNote.value]
  })

  function addNote(data) {
    // TODO
    notes.value.push(data)
  }

  function resetNoteOverlay() {
    selectedNote.value = null
    isAddingNote.value = false
    isEditingNote.value = false
  }

  return {
    notes,
    selectedNote,
    selectedNoteDetail,
    isAddingNote,
    isEditingNote,
    displayedNotes,
    isLoading,

    addNote,
    resetNoteOverlay,
  }
})
