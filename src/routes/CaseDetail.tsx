import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { apiGet, apiDelete } from '../services/api'
import ConfirmBar from '../components/ConfirmBar'

type HeirInput = { relation: string; count?: number }
type Share = { relation: string; fraction: string; percent: string | number }
type Amount = { relation: string; value: number; currency?: string }
type Result = {
  shares: Share[]
  basis: string
  calculation_details: string
  amounts?: Amount[]
}
type CaseRecord = {
  caseId: string
  title?: string
  notes?: string
  createdAt?: string
  input?: { heirs?: HeirInput[] }
  result?: Result
}

export default function CaseDetail() {
  const { state } = useLocation() as { state?: { result?: Result } }
  const { caseId } = useParams()
  const navigate = useNavigate()

  const [record, setRecord] = useState<CaseRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (state?.result && caseId) {
      const local = localStorage.getItem(`case:${caseId}`)
      const fromLocal = local ? JSON.parse(local) : null
      setRecord({
        caseId,
        title: 'قضية',
        notes: '',
        createdAt: '',
        input: { heirs: [] },
        result: state.result || fromLocal
      })
    }
  }, [state, caseId])

  useEffect(() => {
    if (!caseId) return
    if (record?.caseId === caseId && record?.result && record?.input) return
    ;(async () => {
      try {
        setLoading(true)
        const r = await apiGet(`/cases/${caseId}`)
        setRecord(r)
      } catch (e: any) {
        setError(e?.message || 'تعذّر تحميل القضية')
      } finally {
        setLoading(false)
      }
    })()
  }, [caseId])

  const heirs = useMemo(() => record?.input?.heirs ?? [], [record])
  const totalHeirs = useMemo(
    () => heirs.reduce((acc, h) => acc + (Number.isInteger(h.count) ? (h.count as number) : 1), 0),
    [heirs]
  )
  const result = record?.result

  async function handleDelete() {
    if (!record?.caseId) return
    try {
      setDeleting(true)
      await apiDelete(`/cases/${record.caseId}`)
      navigate('/cases-list', { replace: true })
    } catch (e: any) {
      setConfirmOpen(false)
      alert(e?.message || 'تعذّر حذف القضية')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-600">جارٍ التحميل…</div>
  if (error)   return <div className="p-6 text-center text-red-600">{error}</div>
  if (!result) return <div className="p-6">لا توجد بيانات لهذه القضية بعد.</div>

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2">
      {confirmOpen && (
        <div className="md:col-span-2">
          <ConfirmBar
            message="هل أنت متأكد من حذف هذه القضية؟ لا يمكن التراجع عن هذا الإجراء."
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
            busy={deleting}
          />
        </div>
      )}

      <div className="bg-white p-4 sm:p-5 rounded-xl shadow">
        <div className="flex items-start justify-between mb-3">
          <h2 className="font-semibold text-base md:text-lg">
            {record?.title || 'القضية'}
          </h2>
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-3 py-1.5 text-sm rounded bg-red-50 text-red-700 hover:bg-red-100"
          >
            حذف
          </button>
        </div>

        {record?.createdAt && (
          <div className="text-xs text-gray-500 mb-2">
            {new Date(record.createdAt).toLocaleString('ar-EG')}
          </div>
        )}
        {record?.notes && <div className="text-sm text-gray-700 mb-3">{record.notes}</div>}

        <div className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
          <div className="mb-3">
            <span className="font-medium">الأساس الفقهي:</span><br/>{result.basis || '—'}
          </div>
          <div>
            <span className="font-medium">تفاصيل الحساب:</span><br/>{result.calculation_details || '—'}
          </div>
        </div>

        {Array.isArray(result.amounts) && result.amounts.length > 0 && (
          <div className="mt-4">
            <div className="font-medium mb-2">مبالغ تقديرية</div>
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="min-w-[440px] sm:min-w-0 w-full text-sm">
                <thead>
                  <tr className="text-right border-b">
                    <th className="py-2 pr-2">الوارث</th>
                    <th className="py-2 pr-2">المبلغ</th>
                    <th className="py-2 pr-2">العملة</th>
                  </tr>
                </thead>
                <tbody>
                  {result.amounts.map((a, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 pr-2">{a.relation}</td>
                      <td className="py-2 pr-2">{a.value}</td>
                      <td className="py-2 pr-2">{a.currency || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3 text-base md:text-lg">الأنصبة والنِّسَب</h2>

        <div className="text-sm text-gray-700 mb-3">
          <div className="font-medium mb-1">عدد الورثة الإجمالي: {totalHeirs}</div>
          {heirs.length > 0 && (
            <ul className="list-disc pr-5 space-y-1">
              {heirs.map((h, i) => {
                const n = Number.isInteger(h.count) ? (h.count as number) : 1
                const label = n > 1 ? `${h.relation} (${n})` : h.relation
                return <li key={i}>{label}</li>
              })}
            </ul>
          )}
        </div>

        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="min-w-[520px] sm:min-w-0 w-full text-sm">
            <thead>
              <tr className="text-right border-b">
                <th className="py-2 pr-2">الوارث</th>
                <th className="py-2 pr-2">النسبة</th>
                <th className="py-2 pr-2">الكسر</th>
              </tr>
            </thead>
            <tbody>
              {result.shares.map((s, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 pr-2">{s.relation}</td>
                  <td className="py-2 pr-2">
                    {typeof s.percent === 'number' ? `${s.percent}%` : s.percent}
                  </td>
                  <td className="py-2 pr-2">{s.fraction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
