import { startTransition, useEffect, useState } from 'react'
import { noteApi } from '../lib/api'
import { sortNotes } from '../lib/notes'
import NotesContext from './notesContext'

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadNotes = async (withLoadingState = true) => {
    if (withLoadingState) {
      setLoading(true)
    }

    setError('')

    try {
      const fetchedNotes = await noteApi.getNotes()
      startTransition(() => {
        setNotes(sortNotes(fetchedNotes))
      })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      if (withLoadingState) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadNotes()
  }, [])

  const createNote = async (payload) => {
    setIsSaving(true)
    setError('')

    try {
      const createdNote = await noteApi.createNote(payload)
      startTransition(() => {
        setNotes((currentNotes) => sortNotes([createdNote, ...currentNotes]))
      })
      setNotice('A new note was added to your collection.')
      return createdNote
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setIsSaving(false)
    }
  }

  const updateNote = async (noteId, payload) => {
    setIsSaving(true)
    setError('')

    try {
      const updatedNote = await noteApi.updateNote(noteId, payload)
      startTransition(() => {
        setNotes((currentNotes) =>
          sortNotes(
            currentNotes.map((note) =>
              note._id === noteId ? updatedNote : note
            )
          )
        )
      })
      setNotice('Your note has been refreshed.')
      return updatedNote
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setIsSaving(false)
    }
  }

  const deleteNote = async (noteId) => {
    setIsDeleting(true)
    setError('')

    try {
      await noteApi.deleteNote(noteId)
      startTransition(() => {
        setNotes((currentNotes) =>
          currentNotes.filter((note) => note._id !== noteId)
        )
      })
      setNotice('The note was removed.')
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setIsDeleting(false)
    }
  }

  const dismissFeedback = () => {
    setError('')
    setNotice('')
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        isSaving,
        isDeleting,
        error,
        notice,
        loadNotes,
        createNote,
        updateNote,
        deleteNote,
        dismissFeedback,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}
