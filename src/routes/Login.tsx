import { buildHostedUiUrl } from '../services/auth'

export default function Login() {
  let href = ''
  try { href = buildHostedUiUrl() } catch {}
  const bad = !href || !href.startsWith('https://')
  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md text-center">
        <h1 className="text-xl font-semibold mb-4">تسجيل الدخول</h1>
        {bad ? (
          <div className="text-red-600 text-sm mb-4">
            لم يتم تكوين عنوان تسجيل الدخول. تحقق من متغيرات البيئة وإعادة البناء.
          </div>
        ) : (
          <a href={href} className="inline-block px-4 py-2 rounded bg-gray-900 text-white">
            المتابعة
          </a>
        )}
        <div className="text-xs text-gray-500 mt-4 break-all">{href || '(no href computed)'}</div>
      </div>
    </div>
  )
}
