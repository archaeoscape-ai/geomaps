import { defineStore } from 'pinia'
import { ref } from 'vue'

const mockData = [
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
]

export const useNoteStore = defineStore('note', () => {
  const notes = ref(mockData)

  function addNote(data) {
    // TODO
    notes.value.push(data)
  }

  return {
    notes,

    addNote,
  }
})
