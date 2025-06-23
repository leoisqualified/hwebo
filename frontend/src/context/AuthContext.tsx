import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

import api from "../services/api";

interface User {
  id: string;
  email: string;
  role: "admin" | "school" | "supplier";
  verified: boolean
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      localStorage.setItem("role", res.data.user.role);
      setRole(res.data.user.role);
      setToken(token);
    } catch (error) {
      setUser(null);
      setRole(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  delete api.defaults.headers.common["Authorization"];
  setUser(null);
  setToken(null);
  setRole(null);
};

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
