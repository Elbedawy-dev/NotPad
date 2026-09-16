import { useState, useContext, useRef, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { LuNotebookPen, LuLogOut, LuLayoutGrid, LuUser } from "react-icons/lu"
import { IoHomeOutline } from "react-icons/io5";

const Navbar = ({ notesCount = 0, activeTab = "all", onTabChange }) => {
  const { user, logout } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  const isDashboard = location.pathname === "/dashboard"
  const isProfile = location.pathname === "/profile"
  const isHome = location.pathname === "/"

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard shortcut ⌘D / Ctrl+D to toggle Dashboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        navigate('/dashboard')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab)
    }
    if (!isHome) {
      navigate("/")
    }
  }

  return (
    <header className="w-full bg-white border-b border-slate-100 px-6 py-3.5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Section: Logo, Title, Badge, Saved Count, Nav Tabs */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <LuNotebookPen className="text-white text-lg" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">Notes</span>
          </Link>

          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
            isDashboard 
              ? "bg-slate-900 text-white border-slate-900" 
              : "bg-slate-100 text-slate-600 border-slate-200"
          }`}>
            Dashboard
          </span>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            {notesCount} notes saved
          </span>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-5 ml-4 text-sm font-medium">
            <button
              onClick={() => handleTabClick("all")}
              className={`transition-colors py-1 cursor-pointer ${
                isHome && activeTab === "all"
                  ? "text-slate-900 font-bold border-b-2 border-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              All Notes
            </button>
            <button
              onClick={() => handleTabClick("pinned")}
              className={`transition-colors py-1 cursor-pointer ${
                isHome && activeTab === "pinned"
                  ? "text-slate-900 font-bold border-b-2 border-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Pinned
            </button>
            <button
              onClick={() => handleTabClick("trash")}
              className={`transition-colors py-1 cursor-pointer ${
                isHome && activeTab === "trash"
                  ? "text-slate-900 font-bold border-b-2 border-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Trash
            </button>
          </nav>
        </div>

        {/* Right Section: Profile & Logout */}
        <div className="relative" ref={menuRef}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <img
                src={user?.avatar || "/avatars/1.png"}
                alt={user?.name || "User Avatar"}
                className="w-9 h-9 rounded-full object-cover border border-slate-200"
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") }}
              />
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || "Sarah Jenkins"}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{user?.email || "sarah.j@minimal.io"}</p>
              </div>
            </button>

            <span className="h-5 w-[1px] bg-slate-200 hidden sm:block"></span>

            <button
              onClick={logout}
              title="Log Out"
              className="text-slate-400 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <LuLogOut size={18} />
            </button>
          </div>

          {/* Dropdown Menu Overlay (Image 1) */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
              <div className="flex items-center gap-3 p-3 bg-slate-50/60 rounded-xl mb-1 border border-slate-100">
                <img
                  src={user?.avatar || "/avatars/1.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") }}
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-0.5 pt-1">
                <button
                  onClick={() => {
                    navigate("/")
                    setMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                    isHome ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IoHomeOutline  size={16} />
                    <span>Home</span>
                  </div>
                  {isHome && <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>}
                </button>

                <button
                  onClick={() => {
                    navigate("/dashboard")
                    setMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                    isDashboard ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LuLayoutGrid size={16} />
                    <span>Dashboard</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono">⌘D</span>
                    {isDashboard && <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>}
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigate("/profile")
                    setMenuOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                    isProfile ? "bg-slate-100 text-slate-900 font-semibold" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LuUser size={16} />
                    <span>Profile</span>
                  </div>
                  {isProfile && <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>}
                </button>

                <div className="my-1 border-t border-slate-100"></div>

                <button
                  onClick={() => {
                    setMenuOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
                >
                  <LuLogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default Navbar
