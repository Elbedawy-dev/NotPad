import { motion } from "framer-motion";
import {
  LuPencil,
  LuTrash2,
  LuCalendar,
  LuClock,
  LuLock,
  LuImage,
} from "react-icons/lu";

const NoteCard = ({ note, onDelete, onEdit, onView, viewMode = "grid" }) => {
  const wordCount = note.body
    ? note.body.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isRecentDate = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    return Math.floor((now - date) / (1000 * 60 * 60 * 24)) <= 1;
  };

  if (viewMode === "list") {
    return (
      <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} onClick={() => onView(note)} 
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100
        dark:border-slate-800 p-4 hover:shadow-sm dark:hover:border-slate-700 
          transition-all group cursor-pointer flex flex-col md:flex-row md:items-center
          justify-between gap-4">

        <div className="flex items-start md:items-center gap-3.5 flex-1">
          {note.image && (
            <img
              src={note.image}
              alt={note.title}
              className="w-12 h-12 rounded-xl object-cover 
            shrink-0 border border-slate-100"
            />
          )}
          
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex 
            items-center gap-1.5 shrink-0 ${
              note.isPublic
                ? "bg-emerald-50 text-emerald-600"
                : "bg-slate-100 text-slate-600"
            }`}>
              
            {note.isPublic ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                Public
              </>
            ) : (
              <>
                <LuLock size={12} /> Private
              </>
            )}
          </span>
          <div>
            <h3 className="font-bold text-slate-900 text-sm hover:text-slate-700 
            transition-colors">
              {note.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1">{note.body}</p>
          </div>
        </div>

        
        <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 border-t 
              md:border-t-0 border-slate-100 pt-2 md:pt-0">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              {isRecentDate(note.createdAt) ? (
                <LuClock size={13} />
              ) : (
                <LuCalendar size={13} />
              )}
              {formatDate(note.createdAt)}
            </span>
            <span>{wordCount} words</span>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 
              transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEdit(note);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 
              rounded-lg transition-colors cursor-pointer">
              <LuPencil size={15} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete(note._id);
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg 
              transition-colors cursor-pointer">
              <LuTrash2 size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} onClick={() => onView(note)} 
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 
      dark:border-slate-800 p-5 hover:shadow-md hover:border-slate-200
      dark:hover:border-slate-700 transition-all group cursor-pointer flex flex-col 
      justify-between h-full overflow-hidden">
      <div>
        {note.image && (
          <div className="-mx-5 -mt-5 mb-4 overflow-hidden border-b border-slate-100">
            
          <img src={note.image}
            alt={note.title}
            className="w-full h-36 object-cover group-hover:scale-105 transition-transform 
            duration-300" />
          </div>
        )}

        <div className="flex items-center justify-between mb-3.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5
              ${note.isPublic
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-slate-100 text-slate-600 border border-slate-200/60"
            }`}>
            {note.isPublic ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{" "}
                Public
              </>
            ) : (
              <>
                <LuLock size={12} /> Private
              </>
            )}
          </span>

          <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
          transition-opacity">            
          
            <button onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 
              rounded-lg transition-colors cursor-pointer">
              <LuPencil size={15} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note._id);
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg 
              transition-colors cursor-pointer">
              <LuTrash2 size={15} />
            </button>
          </div>
        </div>

        <h3 className="font-bold  leading-snug line-clamp-2 mb-2 
        text-slate-700 dark:text-slate-100  transition-colors">
          {note.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-3 mb-5 leading-relaxed font-normal">
          {note.body}
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t 
        border-slate-100/80 pt-3.5 mt-auto font-medium">
        <span className="flex items-center gap-1.5">
          {isRecentDate(note.createdAt) ? (
            <LuClock size={13} />
          ) : (
            <LuCalendar size={13} />
          )}
          {formatDate(note.createdAt)}
        </span>
        <span className="flex items-center gap-2">
          {note.image && <LuImage size={12} className="text-slate-400" />}
          {wordCount} words
        </span>
      </div>
    </motion.div>
  );
};

export default NoteCard;
