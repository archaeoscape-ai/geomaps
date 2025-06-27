const resource = '/api/efeo/maps'

export async function fetchNotes(mapId, { limit, offset }) {
  const response = await axios.get(`${resource}/${mapId}/notes/`, { params: { limit, offset } })
  return response.data
}

export async function fetchNoteGeoms(mapId) {
  const response = await axios.get(`${resource}/${mapId}/notes/geom/`)
  return response.data
}

export async function addNewNote(mapId, data) {
  const response = await axios.post(`${resource}/${mapId}/notes/`, data)
  return response.data
}

export async function updateCurrentNote(mapId, noteId, data) {
  const response = await axios.put(`${resource}/${mapId}/notes/${noteId}/`, data)
  return response.data
}

export async function deleteCurrentNote(mapId, noteId) {
  const response = await axios.delete(`${resource}/${mapId}/notes/${noteId}/`)
  return response.data
}

export async function fetchNoteById(mapId, noteId) {
  const response = await axios.get(`${resource}/${mapId}/notes/${noteId}/`)
  return response.data
}
