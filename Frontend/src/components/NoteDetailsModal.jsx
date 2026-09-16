import { motion, AnimatePresence } from "framer-motion"
import { LuX, LuCalendar } from "react-icons/lu"

const NoteDetailsModal = ({ note, onClose }) => {
  return (
    <AnimatePresence>
      {note && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  note.isPublic ? "bg-green-50 text-green-600" 
                  : "bg-slate-100 text-slate-600"}`}>
                {note.isPublic ? "🌐 Public" : "🔒 Private"}
              </span>
              <button onClick={onClose} className="text-slate-400 hover:text-black">
                <LuX size={20} />
              </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-3">{note.title}</h2>
            <p className="text-slate-600 whitespace-pre-wrap mb-4">{note.body}</p>

            <div className="flex items-center gap-1 text-xs text-slate-400 border-t 
            border-slate-100 pt-3">
              <LuCalendar size={14} />
              {new Date(note.createdAt).toLocaleDateString('en-GB')}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NoteDetailsModal