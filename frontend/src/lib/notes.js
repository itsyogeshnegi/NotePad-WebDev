export const sortNotes = (notes) => {
  return [...notes].sort((left, right) => {
    const leftTime = new Date(left.updatedAt || left.createdAt || 0).getTime()
    const rightTime = new Date(right.updatedAt || right.createdAt || 0).getTime()
    return rightTime - leftTime
  })
}

export const filterNotes = (notes, searchQuery) => {
  const query = searchQuery.trim().toLowerCase()

  if (!query) {
    return notes
  }

  return notes.filter((note) => {
    const title = note.title.toLowerCase()
    const content = note.content.toLowerCase()
    return title.includes(query) || content.includes(query)
  })
}

export const formatDisplayDate = (value) => {
  if (!value) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export const formatShortDate = (value) => {
  if (!value) {
    return 'No date'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export const getWordCount = (content = '') => {
  return content.trim() ? content.trim().split(/\s+/).length : 0
}

export const getReadingTime = (content = '') => {
  const wordCount = getWordCount(content)
  return Math.max(1, Math.ceil(wordCount / 180))
}

export const getExcerpt = (content = '', limit = 140) => {
  if (!content) {
    return 'No note content yet.'
  }

  if (content.length <= limit) {
    return content
  }

  return `${content.slice(0, limit).trim()}...`
}
