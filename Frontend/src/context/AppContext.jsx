import { createContext, useState, useEffect, useContext } from "react"

const translations = {
  en: {
    // Header & Nav
    notes: "Notes",
    dashboard: "Dashboard",
    notesSaved: "notes saved",
    allNotes: "All Notes",
    pinned: "Pinned",
    trash: "Trash",
    home: "Home",
    profile: "Profile",
    logout: "Log Out",
    
    // Notes Page
    workspace: "WORKSPACE",
    dashboardSub: "Dashboard",
    myNotes: "My Notes",
    myNotesSub: "Organize, draft, and publish your personal or shared thoughts.",
    searchPlaceholder: "Search notes by title or body...",
    addNote: "Add Note",
    totalStored: "TOTAL STORED",
    published: "PUBLISHED",
    encryptedPrivate: "ENCRYPTED PRIVATE",
    storageUsed: "STORAGE USED",
    thisWkTag: "+2 this wk",
    publicTag: "Public",
    privateTag: "Private",
    quickDraftPlaceholder: "Quick draft a thought or press Enter to create...",
    return: "Return",
    sort: "Sort:",
    newestFirst: "Newest first",
    oldestFirst: "Oldest first",
    titleAZ: "Title A-Z",
    cloudSync: "Cloud sync active",
    savedLocally: "All changes saved locally",
    exportMarkdown: "Export Markdown",
    shortcuts: "Keyboard Shortcuts",
    storageSettings: "Storage Settings",
    words: "words",
    today: "Today",
    yesterday: "Yesterday",
    noNotesFound: "No notes found",
    noNotesSub: "Create your first note above to get started.",
    loadingNotes: "Loading your notes...",

    // Modals & Actions
    newNoteTitle: "New Note",
    editNoteTitle: "Edit Note",
    titleLabel: "Title",
    writeNotePlaceholder: "Write your note...",
    attachImage: "Attach Image",
    makePublic: "Make this note public",
    addingNote: "Adding Note...",
    saving: "Saving...",
    saveChanges: "Save Changes",
    changesSaved: "Changes Saved!",

    // Dashboard
    overview: "OVERVIEW",
    overviewSub: "An overview of your notes activity.",
    totalNotes: "Total Notes",
    publicNotes: "Public Notes",
    privateNotes: "Private Notes",
    thisWeek: "This Week",
    recentNotes: "Recent Notes",
    latestEntriesSub: "Your latest written entries and drafts",
    viewAllNotes: "View all notes",
    encrypted: "Encrypted",
    active: "Active",

    // Profile Settings
    settingsAccount: "SETTINGS / ACCOUNT",
    manageProfileSub: "Manage your account information and preferences.",
    fullName: "Full Name",
    visibleOnShared: "Visible on shared notes",
    emailAddress: "Email Address",
    verified: "Verified",
    memberSince: "Member since",
    proTier: "Pro Tier",
    dangerZone: "Danger Zone",
    dangerZoneSub: "Deleting your account is permanent. All notes, assets, and sync logs will be wiped instantly.",
    deleteAccount: "Delete Account",
    selectAvatar: "Select or Upload Avatar",
    uploadCustomPhoto: "Upload Custom Photo",
    choosePreset: "Or choose a preset avatar:",
    confirmDeleteTitle: "Delete Account Permanently?",
    confirmDeleteSub: "This action cannot be undone. Your account, profile information, and all saved notes will be permanently erased.",
    cancel: "Cancel",
    yesDelete: "Yes, Delete Account",
    deleting: "Deleting...",
  },
  ar: {
    // Header & Nav
    notes: "الملاحظات",
    dashboard: "لوحة التحكم",
    notesSaved: "ملاحظة محفوظة",
    allNotes: "كل الملاحظات",
    pinned: "المثبتة",
    trash: "سلة المهملات",
    home: "الرئيسية",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج",

    // Notes Page
    workspace: "مساحة العمل",
    dashboardSub: "لوحة التحكم",
    myNotes: "ملاحظاتي",
    myNotesSub: "نظّم، واكتب، وانشر أفكارك الشخصية أو المشتركة.",
    searchPlaceholder: "ابحث في الملاحظات بالعنوان أو المحتوى...",
    addNote: "إضافة ملاحظة",
    totalStored: "إجمالي المحفوظات",
    published: "الملاحظات العامة",
    encryptedPrivate: "الملاحظات الخاصة",
    storageUsed: "المساحة المستعملة",
    thisWkTag: "+2 هذا الأسبوع",
    publicTag: "عامة",
    privateTag: "خاصة",
    quickDraftPlaceholder: "مسودة سريعة.. اكتب فكرتك واضغط Enter لإنشائها...",
    return: "إرسال",
    sort: "الفرز:",
    newestFirst: "الأحدث أولاً",
    oldestFirst: "الأقدم أولاً",
    titleAZ: "العنوان أ-ي",
    cloudSync: "المزامنة السحابية نشطة",
    savedLocally: "جميع التغييرات محفوظة محلياً",
    exportMarkdown: "تصدير Markdown",
    shortcuts: "اختصارات لوحة المفاتيح",
    storageSettings: "إعدادات التخزين",
    words: "كلمة",
    today: "اليوم",
    yesterday: "الأمس",
    noNotesFound: "لم يتم العثور على ملاحظات",
    noNotesSub: "أنشئ ملاحظتك الأولى أعلاه للبدء.",
    loadingNotes: "جاري تحميل ملاحظاتك...",

    // Modals & Actions
    newNoteTitle: "ملاحظة جديدة",
    editNoteTitle: "تعديل الملاحظة",
    titleLabel: "العنوان",
    writeNotePlaceholder: "اكتب ملاحظتك هنا...",
    attachImage: "إرفاق صورة",
    makePublic: "جعل هذه الملاحظة عامة",
    addingNote: "جاري الإضافة...",
    saving: "جاري الحفظ...",
    saveChanges: "حفظ التغييرات",
    changesSaved: "تم حفظ التغييرات!",

    // Dashboard
    overview: "نظرة عامة",
    overviewSub: "ملخص لنشاط وحالة ملاحظاتك.",
    totalNotes: "إجمالي الملاحظات",
    publicNotes: "الملاحظات العامة",
    privateNotes: "الملاحظات الخاصة",
    thisWeek: "هذا الأسبوع",
    recentNotes: "أحدث الملاحظات",
    latestEntriesSub: "أحدث مدوناتك ومسوداتك",
    viewAllNotes: "عرض جميع الملاحظات",
    encrypted: "مشفرة",
    active: "نشطة",

    // Profile Settings
    settingsAccount: "الإعدادات / الحساب",
    manageProfileSub: "إدارة معلومات حسابك وتفضيلاتك الشخصية.",
    fullName: "الاسم الكامل",
    visibleOnShared: "يظهر في الملاحظات المشتركة",
    emailAddress: "البريد الإلكتروني",
    verified: "مُؤكَّد",
    memberSince: "عضو منذ",
    proTier: "الباقة الاحترافية",
    dangerZone: "منطقة الخطر",
    dangerZoneSub: "حذف حسابك أمر نهائي. سيتم مسح جميع الملاحظات والملفات والسجلات فوراً.",
    deleteAccount: "حذف الحساب",
    selectAvatar: "اختر أو ارفع صورة شخصية",
    uploadCustomPhoto: "رفع صورة مخصصة",
    choosePreset: "أو اختر صورة من المجموعات الجاهزة:",
    confirmDeleteTitle: "هل تريد حذف الحساب نهائياً؟",
    confirmDeleteSub: "لا يمكن التراجع عن هذا الإجراء. سيتم مسح معلومات حسابك وجميع ملاحظاتك المحفوظة نهائياً.",
    cancel: "إلغاء",
    yesDelete: "نعم، احذف الحساب",
    deleting: "جاري الحذف...",
  }
}

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  // Theme state: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("notpad_theme") || "light"
  })

  // Language state: 'en' or 'ar'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("notpad_lang") || "en"
  })

  useEffect(() => {
    localStorage.setItem("notpad_theme", theme)
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem("notpad_lang", lang)
    const root = document.documentElement
    root.setAttribute("lang", lang)
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr")
  }, [lang])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const toggleLang = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"))
  }

  const t = (key) => {
    return translations[lang]?.[key] || translations.en?.[key] || key
  }

  return (
    <AppContext.Provider value={{ theme, setTheme, toggleTheme, lang, setLang, toggleLang, t }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
