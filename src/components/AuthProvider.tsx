"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, UserRole } from "@/types/auth";
import { loginAction, logoutAction } from "@/app/actions/auth";

interface AuthContextType {
  session: Session;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use a state initialization function to avoid calling setState inside useEffect on mount
  const [session, setSession] = useState<Session>(() => {
    // Return loading/idle default for SSR or initial client render
    return {
      user: null,
      expiresAt: null,
      status: "loading",
    };
  });

  useEffect(() => {
    // Load and resolve initial session state on the client side
    const storedUser = localStorage.getItem("auth_session_user");
    let initialUser: User | null = null;

    if (storedUser) {
      try {
        initialUser = JSON.parse(storedUser) as User;
      } catch {
        initialUser = null;
      }
    }

    if (!initialUser) {
      initialUser = {
        id: "usr-1001",
        name: "Seyed Alireza",
        email: "alireza@brandintel.ai",
        role: "workspace_admin",
        workspaceId: "ws-tehran",
      };
      localStorage.setItem("auth_session_user", JSON.stringify(initialUser));
    }

    const resolvedUser = initialUser;

    // Sync session server-side cookies
    loginAction(resolvedUser.email, resolvedUser.workspaceId, resolvedUser.id).catch((err) => {
      console.error("Failed to sync initial session cookies:", err);
    });

    // We update state asynchronously or queue it appropriately
    const timer = setTimeout(() => {
      setSession({
        user: resolvedUser,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "authenticated",
      });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string) => {
    setSession((prev) => ({ ...prev, status: "loading" }));

    // Simulate API round-trip delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      id: "usr-1001",
      name: "Seyed Alireza",
      email,
      role: "workspace_admin",
      workspaceId: "ws-tehran",
    };

    localStorage.setItem("auth_session_user", JSON.stringify(mockUser));

    // Secure server-side cookie setting
    await loginAction(mockUser.email, mockUser.workspaceId, mockUser.id);

    setSession({
      user: mockUser,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "authenticated",
    });
  };

  const logout = async () => {
    setSession((prev) => ({ ...prev, status: "loading" }));
    await new Promise((resolve) => setTimeout(resolve, 400));

    localStorage.removeItem("auth_session_user");

    // Clear secure server-side cookies
    await logoutAction();

    setSession({
      user: null,
      expiresAt: null,
      status: "unauthenticated",
    });
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!session.user) return false;

    const roleHierarchy: Record<UserRole, number> = {
      super_admin: 3,
      workspace_admin: 2,
      viewer: 1,
    };

    const userRoleValue = roleHierarchy[session.user.role];
    const requiredRoleValue = roleHierarchy[requiredRole];

    return userRoleValue >= requiredRoleValue;
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
