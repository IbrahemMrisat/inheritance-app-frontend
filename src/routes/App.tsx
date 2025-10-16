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

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 bg-white border-b z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/cases" className="font-semibold">المواريث</Link>
          <div className="flex gap-3">
            {authed ? (
              <>
                <Link to="/cases" className="hover:underline">القضايا</Link>
                <Link to="/cases/new" className="hover:underline">قضية جديدة</Link>
                <button onClick={logout} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">خروج</button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 rounded bg-gray-900 text-white">تسجيل الدخول</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/cases" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/cases" element={<RequireAuth><CasesList /></RequireAuth>} />
          <Route path="/cases/new" element={<RequireAuth><NewCase /></RequireAuth>} />
          <Route path="/cases/:id" element={<RequireAuth><CaseDetail /></RequireAuth>} />
          <Route path="*" element={<div>Not Found</div>} />
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
