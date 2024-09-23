import { defineStore, storeToRefs } from 'pinia'
import { computed, nextTick, ref } from 'vue'
import { useMapStore } from './MapStore'

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
      title: 'test title',
      body: 'this is a body of a note',
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
  const selectedNoteDetail = ref(mockData.results[0])
  const isLoading = ref(false)

  const mapStore = useMapStore()
  const { map } = storeToRefs(mapStore)

  /**
   * @type {import('vue').Ref<{ select: import('ol/interaction').Select } | null>}
   */
  const selectNoteInteractionRef = ref(null)

  /**
   * @type {import('vue').Ref<{ source: import('ol/source/Vector').default } | null>}
   */
  const noteSourceRef = ref(null)

  /**
   * @type {import('vue').Ref<{ overlay: import('ol/Overlay').default } | null>}
   */
  const noteOverlayRef = ref(null)

  /**
   * Check if user is in process of adding a new note by
   * clicking the Add New Note button
   */
  const isAddingNote = ref(false)

  /**
   * Check if user is editing the note using Edit modal
   */
  const isEditingNote = ref(false)

  /**
   * Check if user clicks on the map to add a new note marker
   */
  const isCreatingNote = computed(() => {
    return selectedNote.value?.id === 'new-note'
  })

  /**
   * Note markers displaying on the map
   */
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

  // Programmatically dispatch event and select note feature
  function zoomInNote(note) {
    selectedNote.value = note
    resetNoteOverlay()
    const features = noteSourceRef.value.source.getFeaturesAtCoordinate(note.geom.coordinates)

    if (features.length > 0) {
      for (let i = 0; i < features.length; i++) {
        const feature = features[i]
        if (feature.get('id') === note.id) {
          selectNoteInteractionRef.value.select.getFeatures().clear()
          selectNoteInteractionRef.value.select.getFeatures().extend(features)

          selectNoteInteractionRef.value.select.dispatchEvent({
            type: 'select',
            selected: [feature],
            deselected: [],
            payload: { note },
          })

          // nextTick(() => {
          //   map.value.map.getView().setCenter(note.geom.coordinates)
          // })
        }
      }
    } else {
      console.log('No features found at the given coordinate.')
    }
  }

  return {
    // states
    notes,
    selectedNote,
    selectedNoteDetail,
    isAddingNote,
    isEditingNote,
    displayedNotes,
    isLoading,

    // layer refs
    selectNoteInteractionRef,
    noteSourceRef,
    noteOverlayRef,

    // actions
    addNote,
    resetNoteOverlay,
    zoomInNote,
  }
})
