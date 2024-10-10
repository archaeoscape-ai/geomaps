import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import {
  addNewNote,
  deleteCurrentNote,
  fetchNoteById,
  fetchNoteGeoms,
  fetchNotes,
  updateCurrentNote,
} from '@/api-services/NoteService'
import { useToast } from '@/components/ui/toast'
import { useMapStore } from './MapStore'

export const useNoteStore = defineStore('note', () => {
  const { toast } = useToast()

  const mapStore = useMapStore()
  const { mapRef } = storeToRefs(mapStore)

  const notes = ref(null)
  const notesGeom = ref([])
  const selectedNote = ref(null)
  const selectedNoteDetail = ref()
  const isLoading = ref(false)
  const page = ref(1)
  const pageSize = ref(10)

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

  async function getNotes(mapId) {
    isLoading.value = true
    const data = await fetchNotes(mapId, {
      limit: pageSize.value,
      offset: (page.value - 1) * pageSize.value,
    })
    notes.value = data
    isLoading.value = false
  }

  async function getNotesGeom(mapId) {
    isLoading.value = true
    const data = await fetchNoteGeoms(mapId)
    notesGeom.value = data
    isLoading.value = false
  }

  async function addNote(mapId, data) {
    isLoading.value = true
    await addNewNote(mapId, data)
    await getNotesGeom(mapId)
    await getNotes(mapId)
    isLoading.value = false
    resetNoteOverlay()
    toast({ description: 'Note successfully added!' })
  }

  async function updateNote(mapId, noteId, data) {
    isLoading.value = true
    await updateCurrentNote(mapId, noteId, data)
    await getNotes(mapId)
    isLoading.value = false
    resetNoteOverlay()
    toast({ description: 'Note successfully updated!' })
  }

  async function deleteNote(mapId, noteId) {
    isLoading.value = true
    await deleteCurrentNote(mapId, noteId)
    await getNotesGeom(mapId)
    await getNotes(mapId)
    isLoading.value = false
    resetNoteOverlay()
    toast({ description: 'Note successfully deleted!' })
  }

  async function getNoteById(mapId, noteId) {
    isLoading.value = true
    const data = await fetchNoteById(mapId, noteId)
    selectedNoteDetail.value = data
    isLoading.value = false
  }

  function addNewNoteMarker(coordinates) {
    selectedNote.value = {
      id: 'new-note',
      geom: {
        type: 'Point',
        coordinates,
      },
    }
  }

  function resetNoteOverlay() {
    selectedNote.value = null
    selectedNoteDetail.value = null
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

          mapRef.value.map.getView().animate({ center: [ note.geom.coordinates[0] + 80000, note.geom.coordinates[1] ], duration: 1000 })
        }
      }
    } else {
      console.log('No features found at the given coordinate.')
    }
  }

  function reset() {
    noteSourceRef.value?.source.clear()
    noteSourceRef.value?.source.changed()
    notes.value = null
    notesGeom.value = []
    selectedNote.value = null
    selectedNoteDetail.value = null
    isLoading.value = false
    page.value = 1
    pageSize.value = 10
    selectNoteInteractionRef.value = null
    noteSourceRef.value = null
    noteOverlayRef.value = null
    isAddingNote.value = false
    isEditingNote.value = false
  }

  return {
    // states
    notes,
    selectedNote,
    selectedNoteDetail,
    isAddingNote,
    isEditingNote,
    isCreatingNote,
    displayedNotes,
    isLoading,
    page,
    pageSize,

    // layer refs
    selectNoteInteractionRef,
    noteSourceRef,
    noteOverlayRef,

    // actions
    addNote,
    addNewNoteMarker,
    resetNoteOverlay,
    zoomInNote,
    getNotes,
    getNotesGeom,
    updateNote,
    deleteNote,
    getNoteById,
    reset,
  }
})
