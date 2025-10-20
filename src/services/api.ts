const API_BASE = import.meta.env.VITE_API_BASE as string
import { getIdToken } from './auth'

async function req(path: string, opts: RequestInit = {}) {
  const token = getIdToken()
  const headers = new Headers(opts.headers || {})
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)
  const res = await fetch(API_BASE + path, { ...opts, headers })
  if (res.status === 204) return null
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const apiGet    = (path: string) => req(path)
export const apiPost   = (path: string, body: unknown) => req(path, { method: 'POST', body: JSON.stringify(body) })
export const apiDelete = (path: string) => req(path, { method: 'DELETE' })
