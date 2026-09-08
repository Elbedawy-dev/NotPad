import {useState, useEffect} from "react";
import { createContext } from "react";
import api from "../api/axios";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data);
  };

  const Login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser(res.data);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };


return (
    <AuthContext.Provider value={{ user, register, Login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
