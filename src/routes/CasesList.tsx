import { useEffect, useState } from 'react'
import { apiGet, apiDelete } from '../services/api'
import { Link } from 'react-router-dom'
import ConfirmBar from '../components/ConfirmBar'

interface CaseSummary {
  caseId: string
  title?: string
  createdAt?: string
  sharesCount?: number
  basis?: string
  heirCount?: number
}

export default function CasesList() {
  const [items, setItems] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [confirmFor, setConfirmFor] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiGet('/cases-list')
      setItems(res.items || [])
    } catch (e: any) {
      setError(e?.message || 'تعذّر تحميل القضايا')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onDelete = async () => {
    if (!confirmFor) return
    try {
      setBusyId(confirmFor)
      await apiDelete(`/cases/${confirmFor}`)
      setItems(items => items.filter(x => x.caseId !== confirmFor))
      setConfirmFor(null)
    } catch (e: any) {
      setConfirmFor(null)
      alert(e?.message || 'تعذّر حذف القضية')
    } finally {
      setBusyId(null)
    }
  }

  // dd/mm/yyyy hh:mm using English numerals
  const formatDateTime = (iso?: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    const hh = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`
  }

  if (loading) return <div className="p-6 text-center text-gray-600">جارٍ التحميل…</div>
  if (error)   return <div className="p-6 text-center text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">القضايا</h1>

      {items.length === 0 ? (
        <div className="text-gray-600 text-center">لا توجد قضايا بعد.</div>
      ) : (
        <div className="grid gap-3">
          {items.map(c => (
            <div key={c.caseId} className="bg-white p-4 rounded-xl shadow hover:shadow-md transition-shadow">
              {confirmFor === c.caseId && (
                <div className="mb-3">
                  <ConfirmBar
                    message="هل أنت متأكد من حذف هذه القضية؟ لا يمكن التراجع."
                    onConfirm={onDelete}
                    onCancel={() => setConfirmFor(null)}
                    busy={busyId === c.caseId}
                  />
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <Link to={`/cases/${c.caseId}`} className="font-medium text-gray-800 hover:underline flex-1">
                  {c.title || 'قضية'}
                </Link>
                <div className="text-xs text-gray-500">
                  {formatDateTime(c.createdAt)}
                </div>
              </div>

              <div className="text-sm text-gray-600 mt-1">
                عدد الورثة: {c.heirCount ?? 0} • عدد الأسهم: {c.sharesCount ?? 0}
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  to={`/cases/${c.caseId}`}
                  className="px-3 py-1.5 text-sm rounded bg-gray-900 text-white hover:bg-gray-800 transition"
                >
                  عرض
                </Link>
                <button
                  onClick={() => setConfirmFor(c.caseId)}
                  disabled={busyId === c.caseId}
                  className="px-3 py-1.5 text-sm rounded bg-red-50 text-red-700 hover:bg-red-100 transition disabled:opacity-60"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
