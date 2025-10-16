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
