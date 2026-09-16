import { useState, useEffect } from "react"
import api from "../api/axios"
import NoteCard from "../components/NoteCard"
import { LuPlus, LuSearch } from "react-icons/lu"
import { AnimatePresence } from "framer-motion"
import AddNoteModal from "../components/AddNoteModal"
import NoteDetailsModal from "../components/NoteDetailsModal"

const Home = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)  
  const [selectedNote, setSelectedNote] = useState(null)

  const handleNoteAdded = (newNote) => {
      setNotes([newNote, ...notes])
  }

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes")
        setNotes(res.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter((n) => n._id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (note) => {
    console.log("edit", note)
  }

  const filteredNotes = notes.filter((note) => {
    if (filter === "public") return note.isPublic
    if (filter === "private") return !note.isPublic
    return true
  })

return (
  <div className="min-h-screen bg-[#f6f6fb] px-8 py-8">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Notes</h1>
        <p className="text-slate-400 text-sm">Organize, draft, and publish your personal or shared 
          thoughts.</p>
      </div>
      <button onClick={() => setIsModalOpen(true)} className="bg-black text-white rounded-lg 
      px-4 py-2.5 flex items-center gap-2 font-medium">
          <LuPlus size={18} /> Add Note
      </button>
    </div>

    <div className="flex items-center gap-2 mb-6">
      {["all", "public", "private"].map((f) => (
        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm 
          font-medium capitalize ${
            filter === f ? "bg-black text-white" : "bg-white text-slate-600 border border-slate-200"}`}>
          {f === "all" ? "All Notes" : f}
        </button>
      ))}
    </div>

    {loading ? (
      <p className="text-slate-400">Loading...</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <NoteCard key={note._id} 
            note={note} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
            onView={setSelectedNote}/>

          ))}
        </AnimatePresence>
      </div>
    )}

    <AddNoteModal 
    isOpen={isModalOpen} 
    onClose={() => setIsModalOpen(false)} 
    onNoteAdded={handleNoteAdded} />

    <NoteDetailsModal 
    note={selectedNote} 
    onClose={() => setSelectedNote(null)} 
/>
  </div>
)
}

export default Home