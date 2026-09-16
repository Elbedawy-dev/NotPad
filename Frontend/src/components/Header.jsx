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

  // const navLinks = [
  //   { name: "Home", path: "/" },
  //   { name: "MyNotes", path: "/mynotes" },
  //   { name: "Dashboard", path: "/dashboard" },
  // ];

  return (
    <div>Header</div>
  )
};

export default Header;