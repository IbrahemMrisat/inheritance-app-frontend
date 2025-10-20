import { Link, useNavigate, useLocation } from 'react-router-dom'
import { isLoggedIn, logout } from '../services/auth'
import logo from '../images/navbar_logo.png'

export default function NavBar() {
  const authed = isLoggedIn()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  // Determine if we’re on login or callback
  const isLoginPage = pathname === '/login' || pathname === '/callback'

  return (
    <nav className="sticky top-0 bg-white/95 backdrop-blur border-b z-10 shadow-sm">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Left side: logo */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="المواريث"
            className="h-7 w-auto object-contain"
          />
          <span className="hidden sm:inline-block text-gray-800 font-semibold">المواريث</span>
        </div>

        {/* Right side: actions (hidden on login page) */}
        {!isLoginPage && authed && (
          <div className="flex flex-wrap gap-2 md:gap-3">
            <Link
              to="/cases-list"
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
          </div>
        )}
      </div>
    </nav>
  )
}
