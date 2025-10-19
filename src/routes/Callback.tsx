import { useEffect } from 'react'
import { exchangeCodeForTokens } from '../services/auth'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Callback() {
  const navigate = useNavigate()
  const { search } = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(search)
    const code = params.get('code')
    if (!code) { navigate('/login', { replace: true }); return }
    (async () => {
      try {
        await exchangeCodeForTokens(code)
        navigate('/cases-list', { replace: true })
      } catch (e) {
        console.error(e)
        navigate('/login', { replace: true })
      }
    })()
  }, [search, navigate])

  return <div className="p-6">جارٍ التحقق من الجلسة...</div>
}
