import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import api from "../api/axios"
import { useApp } from "../context/AppContext"
import { LuX, LuImage, LuTrash2 } from "react-icons/lu"

const AddNoteModal = ({ isOpen, onClose, onNoteAdded }) => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { t } = useApp()

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
      const res = await api.post("/notes", { title, body, isPublic })
      let createdNote = res.data.Note || res.data.note || res.data

      if (imageFile && createdNote._id) {
        const formData = new FormData()
        formData.append("image", imageFile)
        const imgRes = await api.post(`/notes/${createdNote._id}/image`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        createdNote = imgRes.data.note || createdNote
      }

      onNoteAdded(createdNote)
      setTitle("")
      setBody("")
      setIsPublic(false)
      setImageFile(null)
      setImagePreview(null)
      onClose()
    } catch (error) {
      console.log("Error adding note:", error)
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
          className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-100 dark:border-slate-800 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg text-slate-900 dark:text-white">{t("newNoteTitle")}</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <input
                type="text"
                placeholder={t("titleLabel")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-white dark:bg-slate-950 border border-slate-200 
                dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold 
                text-slate-900 dark:text-white placeholder:text-slate-400 
                dark:placeholder:text-slate-500 outline-none focus:border-slate-900
                dark:focus:border-slate-600 shadow-2xs"
              />
              <textarea
                placeholder={t("writeNotePlaceholder")}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={4}
                className="bg-white dark:bg-slate-950 border border-slate-200 
                dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-medium 
                text-slate-900 dark:text-white placeholder:text-slate-400 
                dark:placeholder:text-slate-500 outline-none focus:border-slate-900 
                dark:focus:border-slate-600 shadow-2xs resize-none"
              />

              {/* Image Preview & Upload Control */}
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 
                dark:border-slate-800 group">
                  <img src={imagePreview} alt="Preview" className="w-full h-36 object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black 
                    text-white p-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    <LuTrash2 size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 border border-dashed 
                border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs font-medium 
                text-slate-500 dark:text-slate-400 hover:border-slate-800 
                dark:hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200 
                transition-colors cursor-pointer bg-slate-50/50 dark:bg-slate-800/40">
                  <LuImage size={16} />
                  <span>{t("attachImage")}</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}

              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded text-slate-900 dark:bg-slate-950 dark:border-slate-800 focus:ring-0 cursor-pointer"
                />
                <span>{t("makePublic")}</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 
                dark:hover:bg-slate-700 text-white rounded-xl py-3 font-semibold text-xs 
                mt-2 disabled:opacity-50 transition-colors cursor-pointer">
                {submitting ? t("addingNote") : t("addNote")}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AddNoteModal
