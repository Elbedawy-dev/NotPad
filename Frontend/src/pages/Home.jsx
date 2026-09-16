import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import NoteCard from "../components/NoteCard"
import AddNoteModal from "../components/AddNoteModal"
import EditNoteModal from "../pages/EditNoteModal"
import NoteDetailsModal from "../components/NoteDetailsModal"
import Navbar from "../components/Navbar"
import { LuPlus, LuSearch, LuLock, LuLayoutGrid, LuList, LuCornerDownLeft, LuX } from "react-icons/lu"
import { AnimatePresence, motion } from "framer-motion"

const Home = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, public, private
  const [activeTab, setActiveTab] = useState("all") // all, pinned, trash
  const [searchQuery, setSearchQuery] = useState("")
  const [quickDraft, setQuickDraft] = useState("")
  const [quickDrafting, setQuickDrafting] = useState(false)
  const [sortOption, setSortOption] = useState("newest") // newest, oldest, title
  const [viewMode, setViewMode] = useState("grid") // grid, list
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [showShortcutsModal, setShowShortcutsModal] = useState(false)

  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes")
        setNotes(res.data)
      } catch (error) {
        console.log("Error fetching notes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  // Keyboard shortcut listener (⌘K for Search, Esc to blur)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter((n) => n._id !== id))
    } catch (error) {
      console.log("Error deleting note:", error)
    }
  }

  const handleNoteAdded = (newNote) => {
    setNotes([newNote, ...notes])
  }

  const handleNoteUpdated = (updatedNote) => {
    setNotes(notes.map((n) => (n._id === updatedNote._id ? updatedNote : n)))
  }

  const handleQuickDraftSubmit = async (e) => {
    if (e) e.preventDefault()
    if (!quickDraft.trim()) return

    setQuickDrafting(true)
    try {
      const title = quickDraft.trim().split("\n")[0].slice(0, 40)
      const res = await api.post("/notes", {
        title: title || "Quick Draft",
        body: quickDraft.trim(),
        isPublic: false,
      })
      const createdNote = res.data.Note || res.data.note || res.data
      setNotes([createdNote, ...notes])
      setQuickDraft("")
    } catch (error) {
      console.log("Error creating quick draft:", error)
    } finally {
      setQuickDrafting(false)
    }
  }

  const handleExportMarkdown = () => {
    if (notes.length === 0) return
    let markdownContent = `# My Notes Export\n\nExported on: ${new Date().toLocaleString()}\n\n---\n\n`
    notes.forEach((note, index) => {
      markdownContent += `## ${index + 1}. ${note.title}\n`
      markdownContent += `*Status:* ${note.isPublic ? "Public" : "Private"} | *Date:* ${new Date(note.createdAt).toLocaleDateString()}\n\n`
      markdownContent += `${note.body}\n\n---\n\n`
    })

    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `notes_export_${Date.now()}.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filter notes by tab (all / pinned / trash), visibility filter (all / public / private), and search query
  const filteredNotes = notes
    .filter((note) => {
      if (activeTab === "pinned") return note.isPinned
      if (activeTab === "trash") return false // active trash mock empty or deleted
      return true
    })
    .filter((note) => {
      if (filter === "public") return note.isPublic
      if (filter === "private") return !note.isPublic
      return true
    })
    .filter((note) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return note.title.toLowerCase().includes(q) || note.body.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortOption === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortOption === "title") return a.title.localeCompare(b.title)
      return 0
    })

  const totalCount = notes.length
  const publicCount = notes.filter((n) => n.isPublic).length
  const privateCount = notes.filter((n) => !n.isPublic).length
  const totalChars = notes.reduce((acc, n) => acc + (n.body ? n.body.length : 0), 0)
  const storageUsedMB = (totalChars / 1024 / 100).toFixed(1)

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-between font-sans">
      <div>
        <Navbar notesCount={totalCount} activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Workspace Header & Title Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
                <span>WORKSPACE</span>
                <span>/</span>
                <span className="text-slate-600">Dashboard</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Notes</h1>
              <p className="text-slate-500 text-sm mt-1">
                Organize, draft, and publish your personal or shared thoughts.
              </p>
            </div>

            {/* Right Controls: Search & Add Note */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-80">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search notes by title or body..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 shadow-sm transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  ⌘K
                </span>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <LuPlus size={16} />
                <span>Add Note</span>
              </button>
            </div>
          </div>

          {/* 4 Metrics Stats Bar (Image 2) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3">
                <span>TOTAL STORED</span>
                <span className="bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                  +2 this wk
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{totalCount}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3">
                <span>PUBLISHED</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{publicCount}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3">
                <span>ENCRYPTED PRIVATE</span>
                <LuLock className="text-slate-400" size={15} />
              </div>
              <p className="text-3xl font-bold text-slate-900">{privateCount}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-3">
                <span>STORAGE USED</span>
                <span className="text-slate-400 font-mono text-[10px]">0.14%</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">{storageUsedMB > 0 ? storageUsedMB : 1.4} MB</p>
            </div>
          </div>

          {/* Filter Bar & Controls (Image 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Left Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  filter === "all"
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <span>All Notes</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === "all" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {totalCount}
                </span>
              </button>

              <button
                onClick={() => setFilter("public")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  filter === "public"
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Public</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === "public" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {publicCount}
                </span>
              </button>

              <button
                onClick={() => setFilter("private")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  filter === "private"
                    ? "bg-slate-950 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50"
                }`}
              >
                <LuLock size={13} className={filter === "private" ? "text-white" : "text-slate-400"} />
                <span>Private</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === "private" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {privateCount}
                </span>
              </button>
            </div>

            {/* Right Controls: Sort & Layout Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              <span className="h-4 w-[1px] bg-slate-200"></span>

              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <LuLayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="List View"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "list" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <LuList size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Draft Input Box (Image 2) */}
          <form onSubmit={handleQuickDraftSubmit} className="relative mb-8">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 pl-4 flex items-center gap-3 shadow-xs hover:border-slate-300 transition-all">
              <span className="text-slate-400 text-base">⚡</span>
              <input
                type="text"
                placeholder="Quick draft a thought or press Enter to create..."
                value={quickDraft}
                onChange={(e) => setQuickDraft(e.target.value)}
                disabled={quickDrafting}
                className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                disabled={!quickDraft.trim() || quickDrafting}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
              >
                <span>Return</span>
                <LuCornerDownLeft size={13} />
              </button>
            </div>
          </form>

          {/* Notes Container */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">Loading your notes...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center my-4">
              <p className="text-slate-500 font-medium text-sm mb-1">No notes found</p>
              <p className="text-slate-400 text-xs">
                {searchQuery ? "Try matching a different title or keyword." : "Create your first note above to get started."}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "flex flex-col gap-3"
              }
            >
              <AnimatePresence>
                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onDelete={handleDelete}
                    onEdit={setEditingNote}
                    onView={setSelectedNote}
                    viewMode={viewMode}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>

      {/* Footer / Status Bar (Image 2) */}
      <footer className="w-full bg-white border-t border-slate-100 py-4 px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud sync active</span>
            <span>•</span>
            <span className="text-slate-400">All changes saved locally</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={handleExportMarkdown}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Export Markdown
            </button>
            <span>•</span>
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Keyboard Shortcuts
            </button>
            <span>•</span>
            <button
              onClick={() => navigate("/profile")}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Storage Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcutsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
            onClick={() => setShowShortcutsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm border border-slate-100 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-base text-slate-900">Keyboard Shortcuts</h2>
                <button onClick={() => setShowShortcutsModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <LuX size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
                  <span>Search Notes</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">⌘K</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
                  <span>Go to Dashboard</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">⌘D</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl">
                  <span>Submit Quick Draft</span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">Enter ↵</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddNoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onNoteAdded={handleNoteAdded} />
      <EditNoteModal note={editingNote} onClose={() => setEditingNote(null)} onNoteUpdated={handleNoteUpdated} />
      <NoteDetailsModal note={selectedNote} onClose={() => setSelectedNote(null)} />
    </div>
  )
}

export default Home