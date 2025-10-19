import { Route, Routes, Navigate, Link, useLocation } from 'react-router-dom'
import Login from './Login'
import Callback from './Callback'
import CasesList from './CasesList'
import NewCase from './NewCase'
import CaseDetail from './CaseDetail'
import { useEffect, useState } from 'react'
import { getIdToken, logout } from '../services/auth'

export default function App() {
  const [authed, setAuthed] = useState<boolean>(() => !!getIdToken())
  const loc = useLocation()

  useEffect(() => { setAuthed(!!getIdToken()) }, [loc])
  useEffect(() => {
    const onStorage = () => setAuthed(!!getIdToken())
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
        <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-2 md:py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <Link to="/cases" className="font-semibold text-base md:text-lg">المواريث</Link>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {authed ? (
              <>
                <Link to="/cases" className="px-3 py-1.5 text-sm rounded bg-gray-50 hover:bg-gray-100">القضايا</Link>
                <Link to="/cases/new" className="px-3 py-1.5 text-sm rounded bg-gray-900 text-white">قضية جديدة</Link>
                <button onClick={logout} className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200">خروج</button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1.5 text-sm rounded bg-gray-900 text-white">تسجيل الدخول</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 pt-4 pb-24">
        <Routes>
          <Route path="/" element={<Navigate to="/cases" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/cases" element={<RequireAuth><CasesList /></RequireAuth>} />
          <Route path="/cases/new" element={<RequireAuth><NewCase /></RequireAuth>} />
          <Route path="/cases/:caseId" element={<RequireAuth><CaseDetail /></RequireAuth>} />
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Routes>
      </main>
    </div>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getIdToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}
