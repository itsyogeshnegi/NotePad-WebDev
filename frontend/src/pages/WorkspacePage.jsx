import { startTransition, useDeferredValue, useState } from 'react'
import { useNotes } from '../context/useNotes'
import { filterNotes, formatDisplayDate } from '../lib/notes'
import NoteForm from '../components/NoteForm'
import NoteList from '../components/NoteList'
import NotePreview from '../components/NotePreview'
import Modal from '../components/Modal'
import StatusView from '../components/StatusView'

function WorkspacePage() {
  const {
    notes,
    loading,
    isSaving,
    isDeleting,
    error,
    notice,
    createNote,
    updateNote,
    deleteNote,
    dismissFeedback,
  } = useNotes()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [deletingNote, setDeletingNote] = useState(null)

  const deferredSearch = useDeferredValue(searchQuery)
  const filteredNotes = filterNotes(notes, deferredSearch)
  const selectedNote =
    filteredNotes.find((note) => note._id === selectedId) ||
    filteredNotes[0] ||
    null

  const handleSearchChange = (event) => {
    const nextValue = event.target.value
    startTransition(() => {
      setSearchQuery(nextValue)
    })
  }

  const handleCreate = async (payload) => {
    const createdNote = await createNote(payload)
    setSelectedId(createdNote._id)
    setIsCreateOpen(false)
  }

  const handleUpdate = async (payload) => {
    if (!editingNote) {
      return
    }

    const updatedNote = await updateNote(editingNote._id, payload)
    setSelectedId(updatedNote._id)
    setEditingNote(null)
  }

  const handleDelete = async () => {
    if (!deletingNote) {
      return
    }

    await deleteNote(deletingNote._id)
    setDeletingNote(null)
  }

  const totalNotes = notes.length
  const displayedNotes = filteredNotes.length
  const latestTouch = notes[0]?.updatedAt

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Writing studio</p>
          <h2>Write cleanly, browse quickly, and keep every note within reach.</h2>
        </div>
        <div className="hero-metrics">
          <article className="metric-card">
            <span className="eyebrow">Collection</span>
            <strong>{totalNotes}</strong>
            <p>Total notes in your library</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">Search view</span>
            <strong>{displayedNotes}</strong>
            <p>Visible with the current filter</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">Latest edit</span>
            <strong>{latestTouch ? formatDisplayDate(latestTouch) : 'No activity yet'}</strong>
            <p>Most recent note update</p>
          </article>
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
          <span className="eyebrow">Search notes</span>
          <input
            type="search"
            placeholder="Find by title or content"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </label>

        <div className="button-row">
          <button
            type="button"
            className="button button-ghost"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </button>
          <button
            type="button"
            className="button button-primary"
            onClick={() => setIsCreateOpen(true)}
          >
            New note
          </button>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="panel panel-list">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Library</p>
              <h3>Active notes</h3>
            </div>
          </div>

          {loading ? (
            <div className="loading-stack">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          ) : (
            <NoteList
              notes={filteredNotes}
              selectedId={selectedNote?._id || null}
              onSelect={setSelectedId}
              emptyTitle={searchQuery ? 'No matching notes' : 'No notes yet'}
              emptyText={
                searchQuery
                  ? 'Try a different phrase or clear the search to browse everything.'
                  : 'Create your first note to start building your collection.'
              }
            />
          )}
        </div>

        <div className="panel panel-preview">
          {loading ? (
            <div className="loading-stack">
              <div className="skeleton-line skeleton-line-title" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line-short" />
            </div>
          ) : filteredNotes.length ? (
            <NotePreview
              note={selectedNote}
              onEdit={() => setEditingNote(selectedNote)}
              onDelete={() => setDeletingNote(selectedNote)}
            />
          ) : (
            <StatusView
              title={searchQuery ? 'Nothing matches this search' : 'Your studio is ready'}
              text={
                searchQuery
                  ? 'Clear the filter or create a note that matches the topic you have in mind.'
                  : 'Use the New note button to add your first entry.'
              }
            />
          )}
        </div>
      </section>

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
            You are about to remove{' '}
            <strong>{deletingNote?.title || 'this note'}</strong>. This action
            cannot be undone.
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="button button-ghost"
              onClick={() => setDeletingNote(null)}
            >
              Keep note
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

export default WorkspacePage
