import { buildHostedUiUrlPkce } from '../services/auth'

export default function Login() {

  async function go() {
    const url = await buildHostedUiUrlPkce()
    window.location.href = url
  }

  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md text-center">
        <h1 className="text-xl font-semibold mb-4">تسجيل الدخول</h1>
        <button onClick={go} className="px-4 py-2 rounded bg-gray-900 text-white">المتابعة</button>
      </div>
    </div>
  )
}
