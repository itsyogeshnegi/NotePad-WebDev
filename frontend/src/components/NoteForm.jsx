import { useState } from 'react'
import Modal from './Modal'

const createInitialState = (initialValues) => ({
  title: initialValues?.title || '',
  content: initialValues?.content || '',
})

function NoteForm({
  open,
  mode,
  initialValues,
  isSaving,
  onClose,
  onSubmit,
}) {
  const [formValues, setFormValues] = useState(createInitialState(initialValues))
  const [fieldError, setFieldError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formValues.title.trim() || !formValues.content.trim()) {
      setFieldError('Title and content are both required.')
      return
    }

    setFieldError('')
    await onSubmit({
      title: formValues.title.trim(),
      content: formValues.content.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'edit' ? 'Refine note' : 'Create note'}
    >
      <form className="note-form" onSubmit={handleSubmit}>
        <label className="field-group">
          <span>Title</span>
          <input
            type="text"
            name="title"
            placeholder="Weekend ideas, article draft, design notes..."
            value={formValues.title}
            onChange={handleChange}
          />
        </label>

        <label className="field-group">
          <span>Content</span>
          <textarea
            name="content"
            rows="10"
            placeholder="Write with detail, capture fragments, or sketch an idea."
            value={formValues.content}
            onChange={handleChange}
          />
        </label>

        <div className="form-meta">
          <p className="meta-text">
            {formValues.content.trim()
              ? `${formValues.content.trim().split(/\s+/).length} words`
              : 'No words yet'}
          </p>
          {fieldError ? <p className="error-inline">{fieldError}</p> : null}
        </div>

        <div className="modal-actions">
          <button type="button" className="button button-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="button button-primary" disabled={isSaving}>
            {isSaving
              ? mode === 'edit'
                ? 'Saving...'
                : 'Creating...'
              : mode === 'edit'
                ? 'Save changes'
                : 'Create note'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default NoteForm
