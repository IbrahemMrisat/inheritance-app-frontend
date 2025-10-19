import { Link, useNavigate } from 'react-router-dom'
import { isLoggedIn, logout } from '../services/auth'

export default function NavBar() {
  const authed = isLoggedIn()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur border-b z-10">
      <div className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-2 md:py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Logo / Title */}
        <Link to="/cases" className="font-semibold text-base md:text-lg">
          المواريث
        </Link>

        {/* Right side actions */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          {authed ? (
            <>
              <Link
                to="/cases"
                className="px-3 py-1.5 text-sm rounded bg-gray-50 hover:bg-gray-100 transition"
              >
                القضايا
              </Link>

              <Link
                to="/cases/new"
                className="px-3 py-1.5 text-sm rounded bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                قضية جديدة
              </Link>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200 transition"
              >
                خروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 text-sm rounded bg-gray-900 text-white hover:bg-gray-800 transition"
            >
              تسجيل الدخول
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
