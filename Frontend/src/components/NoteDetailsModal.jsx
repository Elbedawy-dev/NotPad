import { motion, AnimatePresence } from "framer-motion"
import { LuX, LuCalendar, LuLock } from "react-icons/lu"

const NoteDetailsModal = ({ note, onClose }) => {
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
            className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-slate-100 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  note.isPublic ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {note.isPublic ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Public Note
                  </>
                ) : (
                  <>
                    <LuLock size={12} /> Private Note
                  </>
                )}
              </span>

              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <LuX size={20} />
              </button>
            </div>

            {note.image && (
              <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                <img src={note.image} alt={note.title} className="w-full max-h-72 object-cover" />
              </div>
            )}

            <h2 className="text-xl font-bold text-slate-900 mb-3">{note.title}</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-6">{note.body}</p>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 border-t border-slate-100 pt-4 font-medium">
              <LuCalendar size={14} />
              <span>{new Date(note.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NoteDetailsModal