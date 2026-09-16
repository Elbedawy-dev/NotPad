import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/axios"
import { LuX } from "react-icons/lu"

const AddNoteModal = ({ isOpen, onClose, onNoteAdded }) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post("/notes", { title, body, isPublic })
      onNoteAdded(res.data.Note)
      setTitle("")
      setBody("")
      setIsPublic(false)
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setSubmitting(false)
    }
  }

return (
<AnimatePresence>
    {isOpen && (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        onClick={onClose}>
        <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        >
        <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">New Note</h2>
            <button onClick={onClose}><LuX /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-slate-200 rounded-lg px-3 py-2 outline-none 
            focus:border-black" />
            <textarea
            placeholder="Write your note..."
            value={body} 
            onChange={(e) => setBody(e.target.value)}
            required
            rows={4}
            className="border border-slate-200 rounded-lg px-3 py-2 outline-none 
            focus:border-black" />
            <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)} />
            Make this note public
            </label>

            <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white rounded-lg py-2.5 font-medium mt-2 disabled:opacity-50">
            {submitting ? "Adding..." : "Add Note"}
            </button>
        </form>
        </motion.div>
    </motion.div>
    )}
</AnimatePresence>
  )
}

export default AddNoteModal