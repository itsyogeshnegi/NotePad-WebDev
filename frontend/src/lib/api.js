import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://notepad-webdev.onrender.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const extractErrorMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback
}

export const noteApi = {
  async getNotes() {
    try {
      const response = await apiClient.get('/api/notes')
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Unable to fetch notes.'))
    }
  },
  async createNote(payload) {
    try {
      const response = await apiClient.post('/api/notes', payload)
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Unable to create note.'))
    }
  },
  async updateNote(noteId, payload) {
    try {
      const response = await apiClient.put(`/api/notes/${noteId}`, payload)
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Unable to update note.'))
    }
  },
  async deleteNote(noteId) {
    try {
      const response = await apiClient.delete(`/api/notes/${noteId}`)
      return response.data
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Unable to delete note.'))
    }
  },
}
