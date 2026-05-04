import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    setUser(false);
  }, []);
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user); return data.user;
  };
  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    setUser(data.user); return data.user;
  };
  const logout = async () => { try { await api.post("/auth/logout"); } catch {} setUser(false); };
  const refreshMe = async () => { const { data } = await api.get("/auth/me"); setUser(data); return data; };
  return <Ctx.Provider value={{ user, login, register, logout, refreshMe }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
