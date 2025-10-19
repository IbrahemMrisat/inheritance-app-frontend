import { useLocation, useParams } from 'react-router-dom'

type Share = { relation: string; fraction: string; percent: string | number }
type Amount = { relation: string; value: number; currency?: string }
type Result = {
  shares: Share[]
  basis: string
  calculation_details: string
  amounts?: Amount[]
}

export default function CaseDetail() {
  const { state } = useLocation() as { state?: { result?: Result } }
  const { caseId } = useParams()
  const result: Result | null =
    state?.result ||
    (caseId ? JSON.parse(localStorage.getItem(`case:${caseId}`) || 'null') : null)

  if (!result) {
    return <div className="p-6 bg-white rounded-xl shadow max-w-2xl">لا توجد بيانات لهذه القضية بعد.</div>
  }

  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2">
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3 text-base md:text-lg">المعلومات الإضافية</h2>
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
