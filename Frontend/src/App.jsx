import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext.jsx";
import Header from "./components/Header.jsx"
import Register from "./pages/Register.jsx"
import Login from "./pages/Login.jsx"
import Home from "./pages/Home.jsx"

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
