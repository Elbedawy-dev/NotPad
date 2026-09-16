import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import api from "../api/axios"
import { LuCamera, LuPencil, LuLock, LuCalendar, LuCheck, LuTriangleAlert, LuTrash2, LuX, LuUpload } from "react-icons/lu"
import { motion, AnimatePresence } from "framer-motion"

const AVATARS = [
  "/avatars/1.png", "/avatars/2.png", "/avatars/3.png", "/avatars/4.png", "/avatars/5.png",
  "/avatars/6.png", "/avatars/7.png", "/avatars/8.png", "/avatars/9.png", "/avatars/10.png",
]

const Profile = () => {
  const { user, setUser, updateProfile, deleteAccount } = useContext(AuthContext)
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.name || "Sarah Jenkins")
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "/avatars/1.png")
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [notesCount, setNotesCount] = useState(12)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user?.name) setFullName(user.name)
    if (user?.avatar) setSelectedAvatar(user.avatar)

    // Fetch notes count for danger zone message
    api.get("/notes")
      .then((res) => setNotesCount(res.data.length))
      .catch(() => setNotesCount(12))
  }, [user])

  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      await updateProfile({ name: fullName, avatar: selectedAvatar })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.log("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleCustomAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append("avatar", file)
    try {
      setSaving(true)
      const res = await api.post("/auth/avatar/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setSelectedAvatar(res.data.avatar)
      if (setUser) setUser(res.data)
      setShowAvatarPicker(false)
    } catch (err) {
      console.error("Error uploading avatar file:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      navigate("/login")
    } catch (error) {
      console.log("Error deleting account:", error)
      setDeleting(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "October 2023"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-between font-sans">
      <div>
        <Navbar notesCount={notesCount} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Title Section (Image 3) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 block">
                SETTINGS / ACCOUNT
              </span>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profile</h1>
            </div>
            <p className="text-slate-500 text-xs font-medium">
              Manage your account information and preferences.
            </p>
          </div>

          {/* Centered Profile Card (Image 3) */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xs">
              
              {/* Avatar & Header */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-3 group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
                  <img
                    src={selectedAvatar}
                    alt={fullName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(fullName) }}
                  />
                  <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center absolute bottom-0 right-0 border-2 border-white shadow-xs group-hover:scale-110 transition-transform">
                    <LuCamera size={14} />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-0.5">{user?.name || fullName}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{user?.email || "sarah.j@minimal.io"}</span>
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSaveChanges} className="space-y-5">
                {/* Field 1: Full Name */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                    <label className="text-slate-800">Full Name</label>
                    <span className="text-slate-400 font-normal">Visible on shared notes</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-2xs"
                    />
                    <LuPencil size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Field 2: Email Address */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                    <label className="text-slate-800">Email Address</label>
                    <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                      Verified
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={user?.email || "sarah.j@minimal.io"}
                      disabled
                      className="w-full bg-slate-50 border border-slate-200/70 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-500 cursor-not-allowed shadow-2xs"
                    />
                    <LuLock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Field 3: Member since */}
                <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-3 px-4 flex items-center justify-between text-xs font-medium text-slate-700">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <LuCalendar size={16} className="text-slate-400" />
                    <span>Member since {formatDate(user?.createdAt)}</span>
                  </div>
                  <span className="bg-slate-200/80 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-[10px]">
                    Pro Tier
                  </span>
                </div>

                {/* Save Changes Button */}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-xl py-3 text-xs flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 cursor-pointer mt-6"
                >
                  {saveSuccess ? (
                    <>
                      <LuCheck size={16} className="text-emerald-400" />
                      <span>Changes Saved!</span>
                    </>
                  ) : saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <LuCheck size={16} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>

              {/* Danger Zone Box (Image 3) */}
              <div className="bg-red-50/50 border border-red-100/80 rounded-2xl p-5 mt-8">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs mb-1.5">
                  <LuTriangleAlert size={16} />
                  <span>Danger Zone</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                  Deleting your account is permanent. All {notesCount} notes, assets, and sync logs will be wiped instantly.
                </p>

                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/60 font-semibold rounded-xl px-4 py-2 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LuTrash2 size={14} />
                  <span>Delete Account</span>
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* Footer / Status Bar (Image 3) */}
      <footer className="w-full bg-white border-t border-slate-100 py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud sync active</span>
            <span>•</span>
            <span className="text-slate-400">All changes saved locally</span>
          </div>

          <div className="flex items-center gap-5">
            <button onClick={() => navigate("/")} className="hover:text-slate-900 transition-colors cursor-pointer">
              Export Markdown
            </button>
            <span>•</span>
            <button onClick={() => navigate("/")} className="hover:text-slate-900 transition-colors cursor-pointer">
              Shortcuts
            </button>
            <span>•</span>
            <button onClick={() => navigate("/profile")} className="hover:text-slate-900 transition-colors cursor-pointer">
              Storage
            </button>
          </div>
        </div>
      </footer>

      {/* Avatar Selection Modal */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            onClick={() => setShowAvatarPicker(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-base text-slate-900">Select or Upload Avatar</h3>
                <button onClick={() => setShowAvatarPicker(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <LuX size={18} />
                </button>
              </div>

              {/* Upload Custom Photo Button */}
              <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-2xl p-3 mb-4 text-xs font-semibold text-slate-700 hover:border-slate-900 hover:bg-slate-50 transition-colors cursor-pointer">
                <LuUpload size={16} />
                <span>Upload Custom Photo</span>
                <input type="file" accept="image/*" onChange={handleCustomAvatarUpload} className="hidden" />
              </label>

              <p className="text-xs font-semibold text-slate-400 mb-2">Or choose a preset avatar:</p>
              <div className="grid grid-cols-5 gap-3 mb-2">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => {
                      setSelectedAvatar(avatar)
                      setShowAvatarPicker(false)
                    }}
                    className={`rounded-full overflow-hidden border-2 transition-transform hover:scale-105 ${
                      selectedAvatar === avatar ? "border-slate-950 ring-2 ring-slate-950/20" : "border-transparent"
                    }`}
                  >
                    <img src={avatar} alt="avatar option" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Account Deletion Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <LuTriangleAlert size={24} />
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-1">Delete Account Permanently?</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                This action cannot be undone. Your account, profile information, and all {notesCount} saved notes will be permanently erased from the server.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl py-2.5 text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl py-2.5 text-xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {deleting ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Profile

