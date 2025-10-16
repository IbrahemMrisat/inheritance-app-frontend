import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { apiPost } from '../services/api'
import { useNavigate } from 'react-router-dom'

const HeirSchema = z.object({ relation: z.string().min(1), count: z.coerce.number().int().min(1) })
const FormSchema = z.object({ title: z.string().optional(), notes: z.string().optional(), heirs: z.array(HeirSchema).min(1) })
type FormValues = z.infer<typeof FormSchema>

export default function NewCase() {
  const navigate = useNavigate()
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { heirs: [{ relation: 'زوج', count: 1 }] }
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'heirs' })

  const onSubmit = async (data: FormValues) => {
    const res = await apiPost('/cases', data)
    navigate(`/cases/${res.summary.caseId}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl bg-white p-5 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-4">قضية جديدة</h1>

      <label className="block mb-2">العنوان (اختياري)
        <input className="mt-1 w-full border rounded px-3 py-2" placeholder="مثال: ماتت عن زوج…" {...register('title')} />
      </label>

      <div className="mb-4">
        <div className="font-medium mb-2">الورثة</div>
        {fields.map((f, idx) => (
          <div key={f.id} className="flex gap-2 mb-2">
            <input className="flex-1 border rounded px-3 py-2" placeholder="صلة القرابة" {...register(`heirs.${idx}.relation` as const)} />
            <input type="number" className="w-24 border rounded px-3 py-2" placeholder="العدد" {...register(`heirs.${idx}.count` as const, { valueAsNumber: true })} />
            <button type="button" onClick={() => remove(idx)} className="px-3 py-2 rounded bg-red-50 text-red-700">حذف</button>
          </div>
        ))}
        <button type="button" onClick={() => append({ relation: '', count: 1 })} className="px-3 py-2 rounded bg-gray-100">+ إضافة وريث</button>
        {errors.heirs && <div className="text-red-600 mt-2">أضف وريثًا واحدًا على الأقل</div>}
      </div>

      <label className="block mb-4">ملاحظات
        <textarea className="mt-1 w-full border rounded px-3 py-2" rows={3} {...register('notes')} />
      </label>

      <button className="px-4 py-2 rounded bg-gray-900 text-white">حفظ وحساب</button>
    </form>
  )
}
