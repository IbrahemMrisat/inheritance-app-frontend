import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiGet, apiDelete } from '../services/api'

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [caseData, setCaseData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet(`/cases/${id}`)
        setCaseData(res)
      } catch (e) {
        console.error(e)
        alert('حدث خطأ أثناء تحميل تفاصيل القضية.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذه القضية؟')) return
    try {
      await apiDelete(`/cases/${id}`)
      alert('تم حذف القضية بنجاح.')
      navigate('/cases-list')
    } catch (e) {
      console.error(e)
      alert('تعذر حذف القضية، حاول مجددًا.')
    }
  }

  if (loading) return <div className="p-6">جارٍ التحميل…</div>
  if (!caseData) return <div className="p-6">القضية غير موجودة.</div>

  // ✅ Format date & time in English numerals, 24-hour format
  const formatDateTime = (iso: string) => {
    const date = new Date(iso)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">{caseData.title || 'قضية المواريث'}</h1>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition"
        >
          حذف القضية
        </button>
      </div>

      <p className="text-gray-600 mb-2">
        تم الإنشاء في: {formatDateTime(caseData.createdAt)}
      </p>

      <p className="text-gray-700 mb-4">{caseData.notes || '—'}</p>

      <h2 className="font-semibold mb-2">الورثة</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">الوارث</th>
            <th className="border px-3 py-2">العدد</th>
            <th className="border px-3 py-2">النسبة</th>
          </tr>
        </thead>
        <tbody>
          {caseData.result?.shares?.map((h: any, i: number) => (
            <tr key={i}>
              <td className="border px-3 py-2">{h.relation}</td>
              <td className="border px-3 py-2 text-center">{h.count || 1}</td>
              <td className="border px-3 py-2 text-center">{h.percent}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {caseData.result?.basis && (
        <div className="mt-6">
          <h3 className="font-semibold mb-1">الأساس:</h3>
          <p className="text-gray-700">{caseData.result.basis}</p>
        </div>
      )}

      {caseData.result?.calculation_details && (
        <div className="mt-4">
          <h3 className="font-semibold mb-1">تفاصيل الحساب:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {caseData.result.calculation_details}
          </p>
        </div>
      )}
    </div>
  )
}
