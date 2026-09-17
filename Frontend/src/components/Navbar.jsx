import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

import {
  LuNotebookPen,
  LuLogOut,
  LuLayoutGrid,
  LuUser,
  LuSun,
  LuMoon,
  LuLanguages,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";

const Navbar = ({ notesCount = 0, activeTab = "all", onTabChange }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme, lang, toggleLang, t } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const isDashboard = location.pathname === "/dashboard";
  const isProfile = location.pathname === "/profile";
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Keyboard shortcut ⌘D / Ctrl+D to toggle Dashboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        navigate("/dashboard");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const handleTabClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
    if (!isHome) {
      navigate("/");
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 
    px-4 sm:px-6 py-3 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section: Logo, Title, Badge, Saved Count, Desktop Nav Tabs */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-black dark:bg-slate-100 rounded-xl flex 
            items-center 
            justify-center shadow-sm group-hover:scale-105 transition-transform">
              <LuNotebookPen className="text-white dark:text-slate-900 text-base sm:text-lg" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white 
            tracking-tight">
              {t("notes")}
            </span>
          </Link>

          <span
            className={`hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-full border 
              transition-colors ${isDashboard ?
                 "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            }`}
          >
            {t("dashboard")}
          </span>

          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium hidden lg:inline-block">
            {notesCount} {t("notesSaved")}
          </span>

          {/* Desktop Nav Tabs */}
          <nav className="hidden md:flex items-center gap-5 ml-2 lg:ml-4 text-sm font-medium">
            <button
              onClick={() => handleTabClick("all")}
              className={`transition-colors py-1 cursor-pointer ${
                isHome && activeTab === "all"
                  ? "text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("allNotes")}
            </button>
            <button
              onClick={() => handleTabClick("pinned")}
              className={`transition-colors py-1 cursor-pointer ${
                isHome && activeTab === "pinned"
                  ? "text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("pinned")}
            </button>
            <button
              onClick={() => handleTabClick("trash")}
              className={`transition-colors py-1 cursor-pointer ${
                isHome && activeTab === "trash"
                  ? "text-slate-900 dark:text-white font-bold border-b-2 border-slate-900 dark:border-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("trash")}
            </button>
          </nav>
        </div>

        {/* Right Section: Theme Toggle, Language Switcher, Profile & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Button */}
          <button
            onClick={toggleLang}
            title={lang === "en" ? "التحويل للعربية" : "Switch to English"}
            className="flex items-center gap-1 text-xs font-semibold px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <LuLanguages size={15} />
            <span>{lang === "en" ? "AR" : "EN"}</span>
          </button>

          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center"
          >
            {theme === "dark" ? <LuSun size={17} /> : <LuMoon size={17} />}
          </button>

          {/* Desktop Divider & User Profile Area */}
          <span className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block"></span>

          {/* Desktop User Profile Area */}
          <div className="relative hidden md:block" ref={menuRef}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
              >
                <img
                  src={user?.avatar || "/avatars/1.png"}
                  alt={user?.name || "User Avatar"}
                  className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user?.name || "User");
                  }}
                />
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {user?.name || "moaaz Jenkins"}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                    {user?.email || "moaaz.j@minimal.io"}
                  </p>
                </div>
              </button>

              <span className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800"></span>

              <button
                onClick={logout}
                title={t("logout")}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <LuLogOut size={18} />
              </button>
            </div>

            {/* Desktop Dropdown Menu Overlay */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in duration-150">
                <div className="flex items-center gap-3 p-3 bg-slate-50/60 dark:bg-slate-800/60 rounded-xl mb-1 border border-slate-100 dark:border-slate-800">
                  <img
                    src={user?.avatar || "/avatars/1.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    onError={(e) => {
                      e.target.src =
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user?.name || "User");
                    }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-0.5 pt-1">
                  <button
                    onClick={() => {
                      navigate("/");
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                      isHome
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IoHomeOutline size={16} />
                      <span>{t("home")}</span>
                    </div>
                    {isHome && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                      isDashboard
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LuLayoutGrid size={16} />
                      <span>{t("dashboard")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/* <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded font-mono">
                        ⌘D
                      </span> */}
                      {isDashboard && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
                      isProfile
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <LuUser size={16} />
                      <span>{t("profile")}</span>
                    </div>
                    {isProfile && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
                    )}
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <LuLogOut size={16} />
                    <span>{t("logout")}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
<AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="md:hidden pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-4 overflow-hidden"
    >
          {/* Mobile Nav Tabs */}
          <div className="flex items-center justify-around bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-medium">
            <button
              onClick={() => handleTabClick("all")}
              className={`flex-1 py-2 text-center rounded-lg transition-all duration-300 ease-out cursor-pointer relative overflow-hidden ${
                isHome && activeTab === "all"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {t("allNotes")}
            </button>
            <button
              onClick={() => handleTabClick("pinned")}
              className={`flex-1 py-2 text-center rounded-lg transition-all duration-300 ease-out cursor-pointer relative overflow-hidden ${
                isHome && activeTab === "pinned"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {t("pinned")}
            </button>
            <button
              onClick={() => handleTabClick("trash")}
              className={`flex-1 py-2 text-center rounded-lg transition-all duration-300 ease-out cursor-pointer relative overflow-hidden ${
                isHome && activeTab === "trash"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-sm scale-105"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {t("trash")}
            </button>
          </div>

          {/* Quick Page Links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium 
                rounded-xl transition-colors cursor-pointer ${ isHome ?
                    "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <IoHomeOutline size={17} />
                <span>{t("home")}</span>
              </div>
              {isHome && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
              )}
            </button>

            <button
              onClick={() => {
                navigate("/dashboard");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl 
                transition-colors cursor-pointer ${ isDashboard ?
                
                  "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LuLayoutGrid size={17} />
                <span>{t("dashboard")}</span>
              </div>
              {isDashboard && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
              )}
            </button>

            <button
              onClick={() => {
                navigate("/profile");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xl 
                transition-colors cursor-pointer ${
                isProfile
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LuUser size={17} />
                <span>{t("profile")}</span>
              </div>
              {isProfile && (
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-white"></span>
              )}
            </button>
          </div>

          {/* User Profile Info & Logout */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl mb-2 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={user?.avatar || "/avatars/1.png"}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user?.name || "User");
                  }}
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || "moaaz Jenkins"}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                    {user?.email || "moaaz.j@minimal.io"}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {notesCount} {t("notesSaved")}
              </span>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-100 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors cursor-pointer"
            >
              <LuLogOut size={16} />
              <span>{t("logout")}</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </header>
  );
};

export default Navbar;
