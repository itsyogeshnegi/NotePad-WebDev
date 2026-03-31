import { formatDisplayDate, getReadingTime, getWordCount } from '../lib/notes'
import StatusView from './StatusView'

function NotePreview({ note, onEdit, onDelete }) {
  if (!note) {
    return (
      <StatusView
        title="Choose a note"
        text="Select a note from the list to read, revise, or remove it."
      />
    )
  }

  return (
    <article className="note-preview">
      <div className="note-preview-top">
        <div>
          <p className="eyebrow">Selected note</p>
          <h3>{note.title}</h3>
        </div>
        <div className="button-row">
          <button type="button" className="button button-ghost" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="button button-danger" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="preview-stat-row">
        <div className="stat-chip">
          <span className="eyebrow">Words</span>
          <strong>{getWordCount(note.content)}</strong>
        </div>
        <div className="stat-chip">
          <span className="eyebrow">Reading time</span>
          <strong>{getReadingTime(note.content)} min</strong>
        </div>
        <div className="stat-chip">
          <span className="eyebrow">Updated</span>
          <strong>{formatDisplayDate(note.updatedAt)}</strong>
        </div>
      </div>

      <div className="note-body">
        {note.content.split('\n').map((paragraph, index) => (
          <p key={`${note._id}-${index}`}>{paragraph || '\u00A0'}</p>
        ))}
      </div>
    </article>
  )
}

export default NotePreview
