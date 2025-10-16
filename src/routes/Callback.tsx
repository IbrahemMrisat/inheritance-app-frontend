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
