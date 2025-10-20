import { useState } from 'react'
import { buildHostedUiUrlPkce } from '../services/auth'

export default function Login() {
  const [loading, setLoading] = useState(false)

  async function go() {
    try {
      setLoading(true)
      const url = await buildHostedUiUrlPkce()
      window.location.href = url
    } catch (e) {
      console.error('Failed to start login flow:', e)
      alert('تعذر بدء تسجيل الدخول. حاول مجددًا.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">تسجيل الدخول</h1>
        <p className="text-gray-600 text-sm mb-6">
          سجّل دخولك للوصول إلى تطبيق المواريث
        </p>

        <button
          onClick={go}
          disabled={loading}
          className={`w-full py-2.5 rounded-lg text-white text-base font-medium transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-900 hover:bg-gray-800'
          }`}
        >
          {loading ? 'جارٍ التوجيه…' : 'تسجيل الدخول'}
        </button>
      </div>
    </div>
  )
}
