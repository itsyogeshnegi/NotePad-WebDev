import { formatShortDate, getExcerpt, getReadingTime, getWordCount } from '../lib/notes'
import StatusView from './StatusView'

function NoteList({
  notes,
  selectedId,
  onSelect,
  emptyTitle,
  emptyText,
}) {
  if (!notes.length) {
    return <StatusView title={emptyTitle} text={emptyText} compact />
  }

  return (
    <div className="note-list">
      {notes.map((note) => {
        const isActive = note._id === selectedId

        return (
          <button
            key={note._id}
            type="button"
            className={`note-list-item ${isActive ? 'is-active' : ''}`}
            onClick={() => onSelect(note._id)}
          >
            <div className="note-list-row">
              <span className="eyebrow">{formatShortDate(note.updatedAt)}</span>
              <span className="note-meta-chip">{getReadingTime(note.content)} min read</span>
            </div>
            <h3>{note.title}</h3>
            <p>{getExcerpt(note.content, 92)}</p>
            <div className="note-list-row note-list-row-muted">
              <span>{getWordCount(note.content)} words</span>
              <span>Updated {formatShortDate(note.updatedAt)}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default NoteList
