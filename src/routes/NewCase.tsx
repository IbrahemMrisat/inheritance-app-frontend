import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiPost } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getIdToken } from '../services/auth'

const HeirSchema = z.object({
  relation: z.string().min(1, 'أدخل صلة القرابة'),
  count: z.coerce.number().int().min(1, 'يجب أن يكون العدد 1 فأكثر')
})
const FormSchema = z.object({
  title: z.string().optional(),
  notes: z.string().optional(),
  heirs: z.array(HeirSchema).min(1, 'أضف وريثًا واحدًا على الأقل')
})
type FormValues = z.infer<typeof FormSchema>

export default function NewCase() {
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { heirs: [{ relation: 'زوج', count: 1 }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'heirs' })

  const onSubmit = async (data: FormValues) => {
    setError(null); setLoading(true)
    try {
      // POST /cases → { caseId, saved, result }
      const out = await apiPost('/case/new', data)
      const caseId = out?.caseId || `local_${Date.now()}`
      // cache result locally so refresh works before GET endpoint is added
      localStorage.setItem(`case:${caseId}`, JSON.stringify(out?.result || {}))
      // redirect to the case page
      nav(`/cases/${caseId}`, { replace: true, state: { result: out?.result || null } })
    } catch (e: any) {
      setError(e?.message || 'تعذّر إنشاء القضية')
    } finally {
      setLoading(false)
    }
  }

  // guard (UI): if someone hits the page directly without token
  if (!getIdToken()) {
    return (
      <div className="max-w-md mx-auto bg-white p-5 rounded-xl shadow">
        <h1 className="text-lg font-semibold mb-2">قضية جديدة</h1>
        <p className="text-sm text-gray-600">الرجاء تسجيل الدخول أولاً لإنشاء قضية.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-pulse text-gray-800 text-sm md:text-base">جارٍ الحساب…</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white p-4 sm:p-5 rounded-xl shadow grid gap-4">
        <h1 className="text-base md:text-xl font-semibold">قضية جديدة</h1>

        <label className="block">
          <span className="block text-sm mb-1">العنوان (اختياري)</span>
          <input className="w-full border rounded px-3 py-2 text-sm md:text-base" {...register('title')} />
        </label>

        <div>
          <div className="text-sm md:text-base font-medium mb-2">الورثة</div>
          {fields.map((f, idx) => (
            <div key={f.id} className="grid grid-cols-1 sm:grid-cols-[1fr,7rem,5.5rem] gap-2 mb-2">
              <input
                className="border rounded px-3 py-2 text-sm md:text-base"
                placeholder="صلة القرابة"
                {...register(`heirs.${idx}.relation` as const)}
              />
              <input
                type="number"
                className="border rounded px-3 py-2 text-sm md:text-base"
                placeholder="العدد"
                {...register(`heirs.${idx}.count` as const, { valueAsNumber: true })}
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="px-3 py-2 rounded text-sm bg-red-50 text-red-700"
              >
                حذف
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ relation: '', count: 1 })}
            className="px-3 py-2 rounded bg-gray-100 text-sm md:text-base"
          >
            + إضافة وريث
          </button>
          {errors.heirs && <div className="text-red-600 mt-2 text-sm">{errors.heirs.message as string}</div>}
        </div>

        <label className="block">
          <span className="block text-sm mb-1">ملاحظات</span>
          <textarea rows={3} className="w-full border rounded px-3 py-2 text-sm md:text-base" {...register('notes')} />
        </label>

        <button
          disabled={loading}
          className={`px-4 py-2 rounded text-white text-sm md:text-base ${loading ? 'bg-gray-500' : 'bg-gray-900'}`}
        >
          {loading ? 'جارٍ الحساب…' : 'حفظ وحساب'}
        </button>

        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  )
}
