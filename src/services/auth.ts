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
