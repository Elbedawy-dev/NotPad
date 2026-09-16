import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/axios"
import { LuX, LuImage, LuTrash2 } from "react-icons/lu"

const EditNoteModal = ({ note, onClose, onNoteUpdated }) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title || "")
      setBody(note.body || "")
      setIsPublic(note.isPublic || false)
      setImagePreview(note.image || null)
      setImageFile(null)
    }
  }, [note])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      let updatedNoteData
      if (imageFile) {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("body", body)
        formData.append("isPublic", isPublic)
        formData.append("image", imageFile)

        const res = await api.put(`/notes/${note._id}`, formData, {
          headers: { "Content-Type" : "multipart/form-data" }
        })
        updatedNoteData = res.data.Note || res.data.note || res.data
      } else {
        const res = await api.put(`/notes/${note._id}`, { title, body, isPublic, image: imagePreview })
        updatedNoteData = res.data.Note || res.data.note || res.data
      }

      onNoteUpdated(updatedNoteData)
      onClose()
    } catch (error) {
      console.log("Error updating note:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {note && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-md border border-slate-100 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-900">Edit Note</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 shadow-2xs"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-slate-900 shadow-2xs resize-none"
              />

              {/* Image Control & Preview */}
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={imagePreview} alt="Note image" className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    <LuTrash2 size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-xl p-3 text-xs font-medium text-slate-500 hover:border-slate-800 hover:text-slate-800 transition-colors cursor-pointer bg-slate-50/50">
                  <LuImage size={16} />
                  <span>Attach Image</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}

              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded text-slate-900 focus:ring-0 cursor-pointer"
                />
                <span>Make this note public</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-950 hover:bg-slate-800 text-white rounded-xl py-3 font-semibold text-xs mt-2 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EditNoteModal
