import { useEffect, useState } from 'react'
import { apiGet } from '../services/api'
import { Link } from 'react-router-dom'

interface CaseSummary {
  caseId: string
  createdAt: string
  sharesCount?: number
  basis?: string
  key?: string
}

export default function CasesList() {
  const [items, setItems] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet('/cases-list')  // Lambda returns { items, count }
        setItems(res.items || [])
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء تحميل القضايا')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="p-6 text-center text-gray-600">جارٍ التحميل…</div>
  if (error)   return <div className="p-6 text-center text-red-500">{error}</div>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">القضايا</h1>

      {items.length === 0 ? (
        <div className="text-gray-600 text-center">لا توجد قضايا بعد.</div>
      ) : (
        <div className="grid gap-3">
          {items.map(c => (
            <Link
              key={c.caseId}
              to={`/cases/${c.caseId}`}
              className="block bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  {c.basis || 'قضية غير معنونة'}
                </span>
                <span className="text-sm text-gray-500">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString('ar-EG') : ''}
                </span>
              </div>

              <div className="text-sm text-gray-600 mt-1">
                عدد الأسهم: {c.sharesCount ?? 0}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
