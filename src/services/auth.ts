import { generatePkcePair } from './pkce'

const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_COGNITO_REDIRECT_URI

export async function buildHostedUiUrlPkce() {
  const { verifier, challenge, method } = await generatePkcePair()
  sessionStorage.setItem('pkce_verifier', verifier)
  const url = new URL(COGNITO_DOMAIN + '/oauth2/authorize')
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', REDIRECT_URI)
  url.searchParams.set('scope', 'openid email')
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', method)
  return url.toString()
}

export async function exchangeCodeForTokens(code: string) {
  const verifier = sessionStorage.getItem('pkce_verifier') || ''
  sessionStorage.removeItem('pkce_verifier')
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  })
  const res = await fetch(COGNITO_DOMAIN + '/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error('Token exchange failed: ' + res.status)
  const json = await res.json()
  const idToken = json.id_token as string | undefined
  const accessToken = json.access_token as string | undefined
  if (idToken) localStorage.setItem('id_token', idToken)
  if (accessToken) localStorage.setItem('access_token', accessToken)
}

export function getIdToken() {
  return localStorage.getItem('id_token') || ''
}
export function isLoggedIn() {
  const t = getIdToken()
  return !!t
}
export function logout() {
  localStorage.removeItem('id_token')
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  sessionStorage.clear()
  window.location.href = '/'
}
