import { useEffect, useState } from 'react'
import { apiGet } from '../services/api'
import { Link } from 'react-router-dom'

interface CaseSummary { caseId: string; createdAt: string; status: string; heirCount: number; title: string }

export default function CasesList() {
  const [items, setItems] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { (async () => {
    try { const res = await apiGet('/cases'); setItems(res.cases || []) }
    finally { setLoading(false) }
  })() }, [])

  if (loading) return <div className="p-6">جارٍ التحميل…</div>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">القضايا</h1>
      <div className="grid gap-3">
        {items.map(c => (
          <Link key={c.caseId} to={`/cases/${c.caseId}`} className="block bg-white p-4 rounded-xl shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-medium">{c.title}</span>
              <span className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleString('ar-EG')}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">عدد الورثة: {c.heirCount} • الحالة: {c.status}</div>
          </Link>
        ))}
        {items.length === 0 && <div className="text-gray-600">لا توجد قضايا بعد.</div>}
      </div>
    </div>
  )
}
