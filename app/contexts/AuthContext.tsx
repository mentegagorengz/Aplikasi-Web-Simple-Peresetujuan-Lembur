"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  username: string;
  nama: string;
  role: "driver" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    if (username === "azis" && password === "driver123") {
      setUser({ username: "azis", nama: "ABDUL AZIS", role: "driver" });
      return true;
    } else if (username === "tribudi" && password === "hc123") {
      setUser({ username: "tribudi", nama: "TRI BUDI AMBARSARI", role: "admin" });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
