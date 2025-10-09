// Inheritance App — React (Vite) Frontend (Cloudflare Pages)
// ---------------------------------------------------------
// Project scaffold (TypeScript + Tailwind + react-router + i18n + Cognito Hosted UI)
// Pages: Login, Callback (token parsing), Cases List, New Case Wizard, Case Detail
// API client expects AWS API Gateway with Cognito JWT authorizer

// ===============================
// package.json
// ===============================
{
  "name": "inheritance-app-frontend",
  "version": "0.1.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-i18next": "^14.1.0",
    "react-router-dom": "^6.26.1",
    "zod": "^3.23.8",
    "@tanstack/react-table": "^8.20.5",
    "echarts": "^5.5.0",
    "i18next": "^23.11.5"
  },
  "devDependencies": {
    "@types/node": "^22.5.2",
    "@types/react": "^18.3.7",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.6.2",
    "vite": "^5.4.2",
    "@vitejs/plugin-react": "^4.3.1"
  }
}

// ===============================
// vite.config.ts
// ===============================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    sourcemap: true
  }
})

// ===============================
// tsconfig.json
// ===============================
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}

// ===============================
// tailwind.config.js
// ===============================
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

// ===============================
// postcss.config.js
// ===============================
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}

// ===============================
// index.html
// ===============================
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inheritance App</title>
  </head>
  <body class="bg-gray-50 text-gray-900">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

// ===============================
// src/styles/tailwind.css
// ===============================
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Simple RTL tweaks */
.rtl { direction: rtl; }
.ltr { direction: ltr; }

// ===============================
// src/env.d.ts
// ===============================
interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_COGNITO_DOMAIN: string
  readonly VITE_COGNITO_CLIENT_ID: string
  readonly VITE_COGNITO_REDIRECT_URI: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}

// ===============================
// src/main.tsx
// ===============================
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './routes/App'
import './styles/tailwind.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// ===============================
// src/routes/App.tsx
// ===============================
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

  useEffect(() => {
    setAuthed(!!getIdToken())
  }, [loc])

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
          <Route path="/cases" element={<RequireAuth>{<CasesList />}</RequireAuth>} />
          <Route path="/cases/new" element={<RequireAuth>{<NewCase />}</RequireAuth>} />
          <Route path="/cases/:id" element={<RequireAuth>{<CaseDetail />}</RequireAuth>} />
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

// ===============================
// src/routes/Login.tsx
// ===============================
import { buildHostedUiUrl } from '../services/auth'

export default function Login() {
  const href = buildHostedUiUrl()
  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md text-center">
        <h1 className="text-xl font-semibold mb-4">تسجيل الدخول</h1>
        <p className="text-gray-600 mb-6">سنعيد توجيهك إلى صفحة الدخول (Cognito).</p>
        <a href={href} className="inline-block px-4 py-2 rounded bg-gray-900 text-white">المتابعة</a>
      </div>
    </div>
  )
}

// ===============================
// src/routes/Callback.tsx
// ===============================
import { useEffect } from 'react'
import { handleCallback } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Callback() {
  const navigate = useNavigate()
  useEffect(() => {
    handleCallback()
    navigate('/cases')
  }, [navigate])
  return <div className="p-6">جارٍ التحقق من الجلسة...</div>
}

// ===============================
// src/routes/CasesList.tsx
// ===============================
import { useEffect, useState } from 'react'
import { apiGet } from '../services/api'
import { Link } from 'react-router-dom'

interface CaseSummary { caseId: string; createdAt: string; status: string; heirCount: number; title: string }

export default function CasesList() {
  const [items, setItems] = useState<CaseSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet('/cases')
        setItems(res.cases || [])
      } finally { setLoading(false) }
    })()
  }, [])

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

// ===============================
// src/routes/NewCase.tsx
// ===============================
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

// ===============================
// src/routes/CaseDetail.tsx
// ===============================
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiGet } from '../services/api'
import * as echarts from 'echarts'

export default function CaseDetail() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    (async () => {
      const res = await apiGet(`/cases/${id}`)
      setData(res)
    })()
  }, [id])

  useEffect(() => {
    if (!data) return
    const el = document.getElementById('chart')
    if (!el) return
    const chart = echarts.init(el)
    const shares = (data.result?.shares || []).map((s: any) => ({ name: s.relation, value: s.percent }))
    chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{ type: 'pie', radius: '65%', data: shares }]
    })
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
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">الوارث</th>
              <th className="py-2">النسبة</th>
              <th className="py-2">الكسر</th>
            </tr>
          </thead>
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

// ===============================
// src/services/auth.ts
// ===============================
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI

export function buildHostedUiUrl() {
  const url = new URL(COGNITO_DOMAIN + '/oauth2/authorize')
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('response_type', 'token')
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('scope', 'openid email')
  return url.toString()
}

export function handleCallback() {
  const hash = window.location.hash.replace('#', '')
  const params = new URLSearchParams(hash)
  const idToken = params.get('id_token')
  const accessToken = params.get('access_token')
  if (idToken) localStorage.setItem('id_token', idToken)
  if (accessToken) localStorage.setItem('access_token', accessToken)
}

export function getIdToken() {
  return localStorage.getItem('id_token') || ''
}

export function logout() {
  localStorage.removeItem('id_token')
  localStorage.removeItem('access_token')
  window.location.href = '/'
}

// ===============================
// src/services/api.ts
// ===============================
const API_BASE = import.meta.env.VITE_API_BASE
import { getIdToken } from './auth'

async function req(path: string, opts: RequestInit = {}) {
  const token = getIdToken()
  const headers = new Headers(opts.headers || {})
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(API_BASE + path, { ...opts, headers })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const apiGet = (path: string) => req(path)
export const apiPost = (path: string, body: any) => req(path, { method: 'POST', body: JSON.stringify(body) })

// ===============================
// .env.example (for Cloudflare Pages → Project Settings → Environment Variables)
// ===============================
// VITE_API_BASE=https://api.yourdomain.com
// VITE_COGNITO_DOMAIN=https://your-domain.auth.eu-central-1.amazoncognito.com
// VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
// VITE_COGNITO_REDIRECT_URI=https://app.yourdomain.com/callback

// ===============================
// README.md (deployment notes)
// ===============================
# Inheritance App — Frontend (Cloudflare Pages)

## Run locally
```bash
npm i
npm run dev
```

Create `.env.local` with:
```
VITE_API_BASE=https://api.yourdomain.com
VITE_COGNITO_DOMAIN=https://your-domain.auth.eu-central-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=xxxxxxxx
VITE_COGNITO_REDIRECT_URI=http://localhost:5173/callback
```

## Deploy to Cloudflare Pages
- Connect repo → Build command: `npm run build` → Output dir: `dist`
- Environment variables (Production): same as above, but redirect URI `https://app.yourdomain.com/callback`.
- Add route rules in Pages (optional) to serve SPA fallback to `/index.html`.

## Cognito setup
- Allowed callback URLs: `https://app.yourdomain.com/callback`, `http://localhost:5173/callback`
- Allowed logout URLs: `https://app.yourdomain.com/`, `http://localhost:5173/`
- CORS: your API Gateway must allow origin `https://app.yourdomain.com`.

## Notes
- RTL default set in `index.html` (lang="ar" dir="rtl").
- Charts: ECharts pie in Case Detail; extend as needed.
- Tables: simple table now; TanStack can be integrated for advanced grids later.
