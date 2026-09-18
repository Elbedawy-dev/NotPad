import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import NoteCard from "../components/NoteCard";
import AddNoteModal from "../components/AddNoteModal";
import EditNoteModal from "../pages/EditNoteModal";
import NoteDetailsModal from "../components/NoteDetailsModal";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";
import {
  LuPlus,
  LuSearch,
  LuLock,
  LuLayoutGrid,
  LuList,
  LuCornerDownLeft,
  LuX,
} from "react-icons/lu";
import { AnimatePresence, motion } from "framer-motion";

const Home = () => {
  const { t, lang } = useApp();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, public, private
  const [activeTab, setActiveTab] = useState("all"); // all, pinned, trash
  const [searchQuery, setSearchQuery] = useState("");
  const [quickDraft, setQuickDraft] = useState("");
  const [quickDrafting, setQuickDrafting] = useState(false);
  const [sortOption, setSortOption] = useState("newest"); // newest, oldest, title
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("notepad_viewMode") || "grid"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
      } catch (error) {
        console.log("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Keyboard shortcut listener (⌘K for Search, Esc to blur)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter((n) => n._id !== id));
    } catch (error) {
      console.log("Error deleting note:", error);
    }
  };

  const handleNoteAdded = (newNote) => {
    setNotes([newNote, ...notes]);
  };

  const handleNoteUpdated = (updatedNote) => {
    setNotes(notes.map((n) => (n._id === updatedNote._id ? updatedNote : n)));
  };

  const handleQuickDraftSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!quickDraft.trim()) return;

    setQuickDrafting(true);
    try {
      const title = quickDraft.trim().split("\n")[0].slice(0, 40);
      const res = await api.post("/notes", {
        title: title || "Quick Draft",
        body: quickDraft.trim(),
        isPublic: false,
      });
      const createdNote = res.data.Note || res.data.note || res.data;
      setNotes([createdNote, ...notes]);
      setQuickDraft("");
    } catch (error) {
      console.log("Error creating quick draft:", error);
    } finally {
      setQuickDrafting(false);
    }
  };

  const handleExportMarkdown = () => {
    if (notes.length === 0) return;
    let markdownContent = `# My Notes Export\n\nExported on: ${new Date().toLocaleString()}\n\n---\n\n`;
    notes.forEach((note, index) => {
      markdownContent += `## ${index + 1}. ${note.title}\n`;
      markdownContent += `*Status:* ${note.isPublic ? "Public" : "Private"} | *Date:* ${new Date(note.createdAt).toLocaleDateString()}\n\n`;
      markdownContent += `${note.body}\n\n---\n\n`;
    });

    const blob = new Blob([markdownContent], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `notes_export_${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter notes by tab (all / pinned / trash), visibility filter (all / public / private),
  //  and search query
  const filteredNotes = notes
    .filter((note) => {
      if (activeTab === "pinned") return note.isPinned;
      if (activeTab === "trash") return false;
      return true;
    })
    .filter((note) => {
      if (filter === "public") return note.isPublic;
      if (filter === "private") return !note.isPublic;
      return true;
    })
    .filter((note) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        note.body.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortOption === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOption === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const totalCount = notes.length;
  const publicCount = notes.filter((n) => n.isPublic).length;
  const privateCount = notes.filter((n) => !n.isPublic).length;
  const totalChars = notes.reduce(
    (acc, n) => acc + (n.body ? n.body.length : 0),
    0,
  );
  const storageUsedMB = (totalChars / 1024 / 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-slate-950 text-slate-900 
    dark:text-slate-100 flex flex-col justify-between font-sans transition-colors">
      <div>
        <Navbar
          notesCount={totalCount}
          activeTab={activeTab}
          onTabChange={setActiveTab} />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Workspace Header & Title Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 
              dark:text-slate-500 tracking-wider uppercase mb-1">
                <span>{t("workspace")}</span>
                <span>/</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {t("dashboardSub")}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {t("myNotes")}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {t("myNotesSub")}
              </p>
            </div>

            {/* Right Controls: Search & Add Note */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-80">
                <LuSearch
                  className={`absolute top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500
                    ${lang === "ar" ? "right-3.5" : "left-3.5"}`}
                  size={17}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}

                  className={`w-full ${lang === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5                  
                   bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 
                     rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100
                   placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none
                   focus:border-slate-400 dark:focus:border-slate-600 shadow-xs transition-all`}
                />
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-950 dark:bg-white dark:text-slate-950 hover:bg-slate-800 
                dark:hover:bg-slate-100 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 
                text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0">
                <LuPlus size={16} />
                <span>{t("addNote")}</span>
              </button>
            </div>
          </div>

          {/* 4 Metrics Stats Bar (Image 2) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 
            dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 
              dark:text-slate-500 tracking-wider uppercase mb-3">
                <span>{t("totalStored")}</span>
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 
                dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full text-[10px]">
                  {t("thisWkTag")}
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {totalCount}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 
            dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 
              dark:text-slate-500 tracking-wider uppercase mb-3">
                <span>{t("published")}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {publicCount}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 
            dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 
              dark:text-slate-500 tracking-wider uppercase mb-3">
                <span>{t("encryptedPrivate")}</span>
                <LuLock
                  className="text-slate-400 dark:text-slate-500"
                  size={15}
                />
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {privateCount}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 
            dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between transition-colors">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 
              dark:text-slate-500 tracking-wider uppercase mb-3">
                <span>{t("storageUsed")}</span>
                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                  0.14%
                </span>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {storageUsedMB > 0 ? storageUsedMB : 1.4} MB
              </p>
            </div>
          </div>

          {/* Filter Bar & Controls (Image 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Left Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer 
                  flex items-center gap-2 whitespace-nowrap ${
                  filter === "all"
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}>
                <span>{t("allNotes")}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === "all" ? 
                  "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                  {totalCount}
                </span>
              </button>

              <button
                onClick={() => setFilter("public")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer 
                  flex items-center gap-2 whitespace-nowrap ${
                  filter === "public"
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{t("publicTag")}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === "public" ? "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                >
                  {publicCount}
                </span>
              </button> 

              <button
                onClick={() => setFilter("private")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer 
                  flex items-center gap-2 whitespace-nowrap ${  filter === "private"                 
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs" 
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <LuLock
                  size={13}
                  className={
                    filter === "private"
                      ? "text-white dark:text-slate-950"
                      : "text-slate-400 dark:text-slate-500"
                  }
                />
                <span>{t("privateTag")}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${filter === "private" ? 
                    "bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                >
                  {privateCount}
                </span>
              </button>
            </div>

            {/* Right Controls: Sort & Layout Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500  
              dark:text-slate-400 
                font-medium">
                <span>{t("sort")}</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 
                  dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold 
                  text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer">
                  <option value="newest">{t("newestFirst")}</option>
                  <option value="oldest">{t("oldestFirst")}</option>
                  <option value="title">{t("titleAZ")}</option>
                </select>
              </div>

              <span className="h-4 w-px bg-slate-200 dark:bg-slate-800"></span>

              <div className="flex items-center bg-white dark:bg-slate-900 border 
              border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => {
                    setViewMode("grid");
                    localStorage.setItem("notepad_viewMode", "grid");
                  }}
                  title="Grid View"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <LuLayoutGrid size={15} />
                </button>
                <button
                  onClick={() => {
                    setViewMode("list");
                    localStorage.setItem("notepad_viewMode", "list");
                  }}
                  title="List View"
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === "list"
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <LuList size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Draft Input Box (Image 2) */}
          <form onSubmit={handleQuickDraftSubmit} className="relative mb-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/90 
            dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-xs 
            hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <span className="text-slate-400 text-base">⚡</span>
              <input
                type="text"
                placeholder={t("quickDraftPlaceholder")}
                value={quickDraft}
                onChange={(e) => setQuickDraft(e.target.value)}
                disabled={quickDrafting}
                className="w-full text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 
                dark:placeholder-slate-500 bg-transparent focus:outline-none"
              />

              <button
                type="submit"
                disabled={!quickDraft.trim() || quickDrafting}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 
                text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold flex 
                items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
              >
                <span>{t("return")}</span>
                <LuCornerDownLeft size={13} />
              </button>
            </div>
          </form>

          {/* Notes Container */}
          {loading ? (
            <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-xs">
              {t("loadingNotes")}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 
            dark:border-slate-800 p-12 text-center my-4 transition-colors">
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">
                {t("noNotesFound")}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                {searchQuery
                  ? "Try matching a different title or keyword."
                  : t("noNotesSub")}
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  : "flex flex-col gap-3"
              }>
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

      {/* Footer / Status Bar */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-100 
      dark:border-slate-800 py-4 px-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center 
        gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{t("createdFooter")}</span>
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      {/* <AnimatePresence>
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
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-slate-100 dark:border-slate-800 shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-base text-slate-900 dark:text-white">
                  {t("shortcuts")}
                </h2>
                <button
                  onClick={() => setShowShortcutsModal(false)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <LuX size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span>Search Notes</span>
                  <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    ⌘K
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span>Go to Dashboard</span>
                  <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span>Submit Quick Draft</span>
                  <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    Enter ↵
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}

      <AddNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onNoteAdded={handleNoteAdded}
      />
      <EditNoteModal
        note={editingNote}
        onClose={() => setEditingNote(null)}
        onNoteUpdated={handleNoteUpdated}
      />
      <NoteDetailsModal
        note={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
};

export default Home;
