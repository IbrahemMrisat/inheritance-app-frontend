import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet } from '../services/api'
import * as echarts from 'echarts'

export default function CaseDetail() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => { (async () => {
    const res = await apiGet(`/cases/${id}`); setData(res)
  })() }, [id])

  useEffect(() => {
    if (!data) return
    const el = document.getElementById('chart'); if (!el) return
    const chart = echarts.init(el)
    const shares = (data.result?.shares || []).map((s: any) => ({ name: s.relation, value: s.percent }))
    chart.setOption({ tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: '65%', data: shares }] })
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('resize', onResize); chart.dispose() }
  }, [data])

  if (!data) return <div className="p-6">جارٍ التحميل…</div>

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">النتيجة</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left border-b">
            <th className="py-2">الوارث</th><th className="py-2">النسبة</th><th className="py-2">الكسر</th>
          </tr></thead>
          <tbody>
            {data.result?.shares?.map((s: any, i: number) => (
              <tr key={i} className="border-b last:border-0">
                <td className="py-2">{s.relation}</td>
                <td className="py-2">{s.percent}%</td>
                <td className="py-2">{s.fraction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-3">المخطط</h2>
        <div id="chart" style={{ width: '100%', height: 320 }} />
      </div>
    </div>
  )
}
