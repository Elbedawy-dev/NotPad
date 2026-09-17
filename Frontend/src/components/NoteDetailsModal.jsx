import { motion, AnimatePresence } from "framer-motion"
import { LuX, LuCalendar, LuLock } from "react-icons/lu"
import { useApp } from "../context/AppContext"

const NoteDetailsModal = ({ note, onClose }) => {
  const { t } = useApp()

  return (
    <AnimatePresence>
      {note && (
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
            className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg max-h-[85vh] 
            overflow-hidden border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col">
            <div className="flex justify-between items-center px-6 pt-6 pb-4 shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  note.isPublic
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {note.isPublic ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {t("publicTag")}
                  </>
                ) : (
                  <>
                    <LuLock size={12} /> {t("privateTag")}
                  </>
                )}
              </span>

              <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer">
                <LuX size={20} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 pb-6">
              {note.image && (
                <div className="mb-4 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <img src={note.image} alt={note.title} className="w-full max-h-72 object-cover" />
                </div>
              )}

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{note.title}</h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">{note.body}</p>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4 font-medium">
                <LuCalendar size={14} />
                <span>{new Date(note.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NoteDetailsModal
