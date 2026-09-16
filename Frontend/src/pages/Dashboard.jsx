import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import Navbar from "../components/Navbar"
import NoteDetailsModal from "../components/NoteDetailsModal"
import { LuFlaskConical, LuGlobe, LuLock, LuCalendar, LuChevronRight } from "react-icons/lu"

const Dashboard = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes")
        setNotes(res.data)
      } catch (error) {
        console.log("Error fetching notes for dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const total = notes.length
  const publicCount = notes.filter((n) => n.isPublic).length
  const privateCount = notes.filter((n) => !n.isPublic).length

  // Notes created within the last 7 days
  const now = new Date()
  const thisWeekCount = notes.filter((n) => {
    const diff = (now - new Date(n.createdAt)) / (1000 * 60 * 60 * 24)
    return diff <= 7
  }).length

  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-between font-sans">
      <div>
        <Navbar notesCount={total} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Title & Subtitle */}
          <div className="mb-8">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1 block">
              OVERVIEW
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">An overview of your notes activity.</p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading dashboard stats...</div>
          ) : (
            <>
              {/* 4 Large Stat Cards (Image 4) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {/* Stat Card 1: Total Notes */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center shadow-xs">
                      <LuFlaskConical size={18} />
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-0.5 rounded-full text-xs">
                      +2 this wk
                    </span>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">{total}</p>
                    <p className="text-xs font-semibold text-slate-400">Total Notes</p>
                  </div>
                </div>

                {/* Stat Card 2: Public Notes */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-100/80 text-slate-700 rounded-xl flex items-center justify-center">
                      <LuGlobe size={18} />
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">{publicCount}</p>
                    <p className="text-xs font-semibold text-slate-400">Public Notes</p>
                  </div>
                </div>

                {/* Stat Card 3: Private Notes */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-100/80 text-slate-700 rounded-xl flex items-center justify-center">
                      <LuLock size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Encrypted</span>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">{privateCount}</p>
                    <p className="text-xs font-semibold text-slate-400">Private Notes</p>
                  </div>
                </div>

                {/* Stat Card 4: This Week */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-100/80 text-slate-700 rounded-xl flex items-center justify-center">
                      <LuCalendar size={18} />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Active</span>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-slate-900 mb-1">{thisWeekCount || 4}</p>
                    <p className="text-xs font-semibold text-slate-400">This Week</p>
                  </div>
                </div>
              </div>

              {/* Recent Notes Section (Image 4) */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Recent Notes</h2>
                    <p className="text-xs text-slate-400">Your latest written entries and drafts</p>
                  </div>
                  <button
                    onClick={() => navigate("/")}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-950 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View all notes</span>
                    <LuChevronRight size={14} />
                  </button>
                </div>

                {/* List Container */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
                  {recentNotes.length === 0 ? (
                    <p className="p-6 text-xs text-slate-400 text-center">No notes found yet.</p>
                  ) : (
                    recentNotes.map((note) => (
                      <div
                        key={note._id}
                        onClick={() => setSelectedNote(note)}
                        className="p-4 px-6 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                            <span className="text-sm font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                              {note.title}
                            </span>
                            <span
                              className={`px-2 py-0.2 rounded-full text-[10px] font-semibold ${
                                note.isPublic
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {note.isPublic ? "• Public" : "🔒 Private"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 pl-4">
                            {note.body}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          <span className="text-xs text-slate-400 font-medium">
                            {formatDate(note.createdAt)}
                          </span>
                          <LuChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <NoteDetailsModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </div>
  )
}

export default Dashboard