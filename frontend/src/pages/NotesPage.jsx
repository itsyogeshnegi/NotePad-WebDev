import { startTransition, useDeferredValue, useState } from 'react'
import { useNotes } from '../context/useNotes'
import {
  filterNotes,
  formatDisplayDate,
  getExcerpt,
  getReadingTime,
  getWordCount,
} from '../lib/notes'
import NoteForm from '../components/NoteForm'
import Modal from '../components/Modal'
import StatusView from '../components/StatusView'

function NotesPage() {
  const {
    notes,
    loading,
    isSaving,
    isDeleting,
    createNote,
    updateNote,
    deleteNote,
    error,
    notice,
    dismissFeedback,
  } = useNotes()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [deletingNote, setDeletingNote] = useState(null)
  const [collectionFilter, setCollectionFilter] = useState('all')
  const [recentThreshold] = useState(() => Date.now() - 3 * 24 * 60 * 60 * 1000)

  const deferredSearch = useDeferredValue(searchQuery)
  const searchedNotes = filterNotes(notes, deferredSearch)
  const filteredNotes = searchedNotes.filter((note) => {
    if (collectionFilter === 'recent') {
      const updatedTime = new Date(note.updatedAt).getTime()
      return updatedTime >= recentThreshold
    }

    if (collectionFilter === 'long') {
      return getWordCount(note.content) > 80
    }

    return true
  })

  const handleSearchChange = (event) => {
    const nextValue = event.target.value
    startTransition(() => {
      setSearchQuery(nextValue)
    })
  }

  const handleCreate = async (payload) => {
    await createNote(payload)
    setIsCreateOpen(false)
  }

  const handleUpdate = async (payload) => {
    if (!editingNote) {
      return
    }

    await updateNote(editingNote._id, payload)
    setEditingNote(null)
  }

  const handleDelete = async () => {
    if (!deletingNote) {
      return
    }

    await deleteNote(deletingNote._id)
    setDeletingNote(null)
  }

  return (
    <div className="page-stack">
      <section className="hero-panel hero-panel-alt">
        <div>
          <p className="eyebrow">Collection library</p>
          <h2>Scan your full archive with a richer library view.</h2>
        </div>
        <div className="pill-row">
          <button
            type="button"
            className={`pill-button ${collectionFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setCollectionFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`pill-button ${collectionFilter === 'recent' ? 'is-active' : ''}`}
            onClick={() => setCollectionFilter('recent')}
          >
            Recently touched
          </button>
          <button
            type="button"
            className={`pill-button ${collectionFilter === 'long' ? 'is-active' : ''}`}
            onClick={() => setCollectionFilter('long')}
          >
            Long reads
          </button>
        </div>
      </section>

      {error || notice ? (
        <div className={`feedback-banner ${error ? 'is-error' : 'is-success'}`}>
          <p>{error || notice}</p>
          <button type="button" className="icon-button" onClick={dismissFeedback}>
            Dismiss
          </button>
        </div>
      ) : null}

      <section className="toolbar-panel">
        <label className="search-field">
          <span className="eyebrow">Search the library</span>
          <input
            type="search"
            placeholder="Search titles, ideas, fragments"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </label>

        <div className="button-row">
          <button
            type="button"
            className="button button-ghost"
            onClick={() => {
              setSearchQuery('')
              setCollectionFilter('all')
            }}
          >
            Reset filters
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={() => setIsCreateOpen(true)}
          >
            Add note
          </button>
        </div>
      </section>

      {loading ? (
        <div className="note-grid">
          <div className="skeleton-card skeleton-card-grid" />
          <div className="skeleton-card skeleton-card-grid" />
          <div className="skeleton-card skeleton-card-grid" />
        </div>
      ) : filteredNotes.length ? (
        <section className="note-grid">
          {filteredNotes.map((note) => (
            <article key={note._id} className="library-card">
              <div className="note-list-row">
                <span className="eyebrow">{formatDisplayDate(note.updatedAt)}</span>
                <span className="note-meta-chip">{getReadingTime(note.content)} min read</span>
              </div>
              <h3>{note.title}</h3>
              <p>{getExcerpt(note.content, 180)}</p>
              <div className="library-card-footer">
                <span>{getWordCount(note.content)} words</span>
                <div className="button-row">
                  <button
                    type="button"
                    className="button button-ghost"
                    onClick={() => setEditingNote(note)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button button-danger"
                    onClick={() => setDeletingNote(note)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <StatusView
          title="No notes in this view"
          text="Adjust your search or filters, or add a new note to expand the library."
          actionLabel="Create a note"
          onAction={() => setIsCreateOpen(true)}
        />
      )}

      {isCreateOpen ? (
        <NoteForm
          open={isCreateOpen}
          mode="create"
          initialValues={{ title: '', content: '' }}
          isSaving={isSaving}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      ) : null}

      {editingNote ? (
        <NoteForm
          open={Boolean(editingNote)}
          mode="edit"
          initialValues={editingNote}
          isSaving={isSaving}
          onClose={() => setEditingNote(null)}
          onSubmit={handleUpdate}
        />
      ) : null}

      <Modal
        open={Boolean(deletingNote)}
        onClose={() => setDeletingNote(null)}
        title="Delete note"
        tone="danger"
      >
        <div className="confirm-stack">
          <p>
            Remove <strong>{deletingNote?.title || 'this note'}</strong> from the
            library?
          </p>
          <div className="modal-actions">
            <button
              type="button"
              className="button button-ghost"
              onClick={() => setDeletingNote(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete note'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default NotesPage
