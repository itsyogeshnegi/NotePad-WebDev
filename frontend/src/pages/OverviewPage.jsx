import { Link } from 'react-router-dom'
import { useNotes } from '../context/useNotes'
import { API_BASE_URL } from '../lib/api'
import {
  formatDisplayDate,
  getExcerpt,
  getReadingTime,
  getWordCount,
} from '../lib/notes'
import StatusView from '../components/StatusView'

function OverviewPage() {
  const { notes, loading } = useNotes()

  const totalWords = notes.reduce(
    (sum, note) => sum + getWordCount(note.content),
    0
  )
  const totalReadingTime = notes.reduce(
    (sum, note) => sum + getReadingTime(note.content),
    0
  )
  const latestNote = notes[0]

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Collection signal</p>
          <h2>Your notes, reading depth, and recent movement at a glance.</h2>
        </div>
        <div className="hero-metrics">
          <article className="metric-card">
            <span className="eyebrow">Notes captured</span>
            <strong>{notes.length}</strong>
            <p>Total entries connected to the live backend</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">Words stored</span>
            <strong>{totalWords}</strong>
            <p>Total written content across the collection</p>
          </article>
          <article className="metric-card">
            <span className="eyebrow">Reading depth</span>
            <strong>{totalReadingTime} min</strong>
            <p>Estimated read time for the full archive</p>
          </article>
        </div>
      </section>

      <section className="overview-grid">
        <article className="panel detail-panel">
          <p className="eyebrow">Connection</p>
          <h3>Production API endpoint</h3>
          <p className="meta-text break-all">{API_BASE_URL}</p>
          <div className="pill-row">
            <span className="pill pill-soft">Render backend</span>
            <span className="pill">{loading ? 'Syncing...' : 'Connected view'}</span>
          </div>
        </article>

        <article className="panel detail-panel">
          <p className="eyebrow">Collection rhythm</p>
          <h3>How this frontend behaves</h3>
          <ul className="feature-list">
            <li>Search is client-side and instant on the fetched notes.</li>
            <li>Create and edit actions use premium modal flows.</li>
            <li>Delete actions require explicit confirmation.</li>
            <li>The workspace and library pages share one live notes store.</li>
          </ul>
        </article>
      </section>

      {latestNote ? (
        <section className="panel detail-panel">
          <p className="eyebrow">Latest note</p>
          <div className="overview-latest">
            <div>
              <h3>{latestNote.title}</h3>
              <p>{getExcerpt(latestNote.content, 260)}</p>
            </div>
            <div className="overview-aside">
              <span>Updated {formatDisplayDate(latestNote.updatedAt)}</span>
              <span>{getWordCount(latestNote.content)} words</span>
              <span>{getReadingTime(latestNote.content)} min read</span>
              <Link to="/" className="button button-primary">
                Open workspace
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <StatusView
          title="No note insights yet"
          text="Once the collection has notes, this overview page will surface its latest activity and depth."
        />
      )}
    </div>
  )
}

export default OverviewPage
