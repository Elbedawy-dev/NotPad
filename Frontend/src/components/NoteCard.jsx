import { motion } from "framer-motion"
import { LuPencil, LuTrash2, LuCalendar } from "react-icons/lu"

const NoteCard = ({ note, onDelete, onEdit, onView }) => {
  return (
 <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      onClick={() => onView(note)}
      className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm 
      transition-shadow group cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
            note.isPublic ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-600"}`}>
          {note.isPublic ? "🌐 Public" : "🔒 Private"}
        </span>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(note)
            }}
            className="text-slate-400 hover:text-black"
          >
            <LuPencil size={16} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(note._id)
            }}
            className="text-slate-400 hover:text-red-500"
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="font-bold text-slate-900 line-clamp-1 mb-2">{note.title}</h3>
      <p className="text-sm text-slate-500 line-clamp-3 mb-4">{note.body}</p>

      <div className="flex items-center gap-1 text-xs text-slate-400 border-t
       border-slate-100 pt-3">
        <LuCalendar size={14} />
      {new Date(note.createdAt).toLocaleDateString('en-GB')}
      </div>
    </motion.div>
  )
}

export default NoteCard