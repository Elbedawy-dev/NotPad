import { useState, useEffect, createContext } from "react";
import api from "../api/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a token in localStorage, fetch the current user to restore session
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    const { token: _t, ...userData } = res.data;
    setUser(userData);
  };

  const Login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    if (res.data.token) localStorage.setItem("token", res.data.token);
    const { token: _t, ...userData } = res.data;
    setUser(userData);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateProfile = async ({ name, avatar }) => {
    const res = await api.put("/auth/profile", { name, avatar });
    setUser(res.data);
    return res.data;
  };

  const deleteAccount = async () => {
    await api.delete("/auth/me");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, register, Login, logout, updateProfile, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
