import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { NotesProvider } from './context/NotesContext.jsx'
import AppShell from './components/AppShell'
import OverviewPage from './pages/OverviewPage'
import WorkspacePage from './pages/WorkspacePage'
import NotesPage from './pages/NotesPage'

function App() {
  return (
    <NotesProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/overview" element={<OverviewPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotesProvider>
  )
}

export default App
