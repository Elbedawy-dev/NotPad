import { Link, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import { Bell, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { MdNoteAlt } from "react-icons/md";

const Header = () => { 
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "MyNotes", path: "/mynotes" },
    { name: "Home", path: "/" },
  ];

  return (
   <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}
    transition={{duration: 0.5}} className="fixed top-0 left-0 w-full z-50
    backdrop-blur-xl bg-[#f8f6f1] border-b border-neutral-300 shadow-md" dir="ltr">

    <div className="max-w-7xl mx-auto flex justify-between  px-6 py-4">      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
      className="flex items-center gap-2 font-bold text-xl text-neutral-900">
        <MdNoteAlt className="w-8 h-8 text-blue-500" />
        <span>NotPad</span>
      </motion.div>
      
    {/* Desktop Menu */}
    <div className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => (
        <motion.div key={link.path} whileHover={{ scale: 1.1 }}>
          <Link to={link.path} className={`relative text-lg
            font-medium transition-all duration-300
            ${location.pathname === link.path ? 
            "text-blue-500" : "text-neutral-700 hover:text-blue-500"}`}>
            {link.name}

            {location.pathname === link.path && (
              <motion.span layoutId="underline" className="absolute left-0
               -bottom-1 w-full h-0.5 bg-blue-400 rounded-full" />
            )}
          </Link>
        </motion.div>
      ))}
    
    {user ? (
      <div className="flex items-center gap-4">
        {/* Profile Icon */}
        <Link to="/profile">
          <motion.div whileHover={{ scale: 1.1 }} className="relative cursor-pointer">
            <User size={22} className="text-blue-500" />
          </motion.div>
        </Link>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout(); 
          }}
          className="ml-2 bg-linear-to-r from-blue-400
          to-blue-500 px-4 py-1.5 rounded-full font-medium text-white
          hover:shadow-lg hover:shadow-blue-300/40 transition-all cursor-pointer">
            logout
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-4">
        <Link to="/login" className="text-lg hover:text-blue-500 
        transition-all font-medium">  
          Login
        </Link>
        <Link to="/register" className="bg-linear-to-r from-blue-400
         to-blue-500 px-4 py-1.5 rounded-full font-medium text-white
           hover:shadow-lg hover:shadow-blue-300/40 transition-all">
          Register
        </Link>
      </div>
    )}
    </div>

    {/* Mobile Menu */}
    <div className="md:hidden flex items-center gap-3">
      <button onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        className="text-neutral-900 text-2xl focus:outline-none">
        {isMobileMenuOpen ? <HiX /> : <HiMenu />}
      </button>
    </div>
    </div>

    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div initial={{height: 0, opacity: 0}} animate={{height: "auto", opacity: 1}}
        exit={{height: 0, opacity: 0}} transition={{duration: 0.3}} 
        className="md:hidden bg-[#f8f6f1] border-t border-neutral-300 overflow-hidden">

        <div className="flex flex-col px-6 py-4 gap-4 text-neutral-900">
        {navLinks.map((link) => {
          return (
            <Link key={link.path} to={link.path} onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-medium transition-all duration-300 hover:text-blue-500
              ${location.pathname === link.path ? "text-blue-500" : "text-neutral-700"}`}>
              {link.name}
            </Link>
          );
        })}
           
        {user ? (
        <div className="flex items-center gap-4 mt-2">
          <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
            <User size={22} className="text-blue-500" />
          </Link>

          <button onClick={() => {
            logout()
            setIsMobileMenuOpen(false);
          }} className="cursor-pointer bg-linear-to-r from-blue-400
            to-blue-500 px-4 py-1.5 rounded-full font-medium
            text-white hover:shadow-lg hover:shadow-blue-300/40 transition-all ">
            Logout
          </button>
        </div>
        ) : (
        <div className="flex flex-col gap-2 mt-2">
          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg
            hover:text-blue-500 transition-all font-medium">  
              Login
          </Link>
          <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-linear-to-r
            from-blue-400 to-blue-500 px-4 py-1.5 rounded-full font-medium text-white
            hover:shadow-lg hover:shadow-blue-300/40 transition-all">
              Register
          </Link>
        </div>
        )}

      </div>
        </motion.div>
      )}
      </AnimatePresence>
     </motion.div>
  )
};

export default Header;