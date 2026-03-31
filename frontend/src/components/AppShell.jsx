import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useNotes } from '../context/useNotes'
import { API_BASE_URL } from '../lib/api'

const navigationItems = [
  { to: '/', label: 'Workspace', eyebrow: 'Write' },
  { to: '/notes', label: 'Library', eyebrow: 'Browse' },
  { to: '/overview', label: 'Overview', eyebrow: 'Signal' },
]

const routeContent = {
  '/': {
    title: 'Editorial workspace',
    subtitle: 'Craft, revise, and organize your notes in one calm studio.',
  },
  '/notes': {
    title: 'All notes',
    subtitle: 'A curated library view with search, quick editing, and browsing.',
  },
  '/overview': {
    title: 'Collection overview',
    subtitle: 'A high-level pulse of your writing habits and note collection.',
  },
}

function AppShell() {
  const { pathname } = useLocation()
  const { notes } = useNotes()
  const [isNavOpen, setIsNavOpen] = useState(false)

  const currentRoute = routeContent[pathname] || routeContent['/']

  return (
    <div className="app-shell">
      <aside className={`side-rail ${isNavOpen ? 'is-open' : ''}`}>
        <div className="brand-lockup">
          <span className="brand-mark">NP</span>
          <div>
            <p className="eyebrow">NotePad Atelier</p>
            <h1 className="brand-title">Curated writing space</h1>
          </div>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-card ${isActive ? 'is-active' : ''}`
              }
              onClick={() => setIsNavOpen(false)}
            >
              <span className="eyebrow">{item.eyebrow}</span>
              <strong>{item.label}</strong>
            </NavLink>
          ))}
        </nav>

        <div className="side-rail-footer">
          <div className="pill-row">
            <span className="pill">{notes.length} notes</span>
            <span className="pill pill-soft">Live API</span>
          </div>
          <p className="meta-text">{API_BASE_URL}</p>
        </div>
      </aside>

      <div className="main-frame">
        <header className="topbar">
          <button
            type="button"
            className="icon-button mobile-only"
            onClick={() => setIsNavOpen((currentValue) => !currentValue)}
            aria-label="Toggle navigation"
          >
            {isNavOpen ? 'Close' : 'Menu'}
          </button>

          <div>
            <p className="eyebrow">Live workspace</p>
            <h2 className="page-title">{currentRoute.title}</h2>
          </div>

          <div className="topbar-meta">
            <p>{currentRoute.subtitle}</p>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
