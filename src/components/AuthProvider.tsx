"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, UserRole } from "@/types/auth";
import { loginAction, logoutAction } from "@/app/actions/auth";

interface AuthContextType {
  session: Session;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(() => {
    return {
      user: null,
      expiresAt: null,
      status: "loading",
    };
  });

  useEffect(() => {
    // Check for existing session on the client side
    const storedUser = localStorage.getItem("auth_session_user");
    let initialUser: User | null = null;

    if (storedUser) {
      try {
        initialUser = JSON.parse(storedUser) as User;
      } catch {
        initialUser = null;
      }
    }

    if (initialUser) {
      // Sync session server-side cookies
      loginAction(initialUser.email, initialUser.workspaceId, initialUser.id).catch((err) => {
        console.error("Failed to sync initial session cookies:", err);
      });

      setSession({
        user: initialUser,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "authenticated",
      });
    } else {
      setSession({
        user: null,
        expiresAt: null,
        status: "unauthenticated",
      });
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setSession((prev) => ({ ...prev, status: "loading" }));

    // Prepare for future backend API integration here
    // e.g. const res = await fetch("/api/v1/auth/login", { ... })
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Extract mock name from email for high-fidelity personalized experience
    const namePart = email.split("@")[0];
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const authenticatedUser: User = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      name: name || "Enterprise User",
      email,
      role: "workspace_admin",
      workspaceId: "ws-default",
    };

    localStorage.setItem("auth_session_user", JSON.stringify(authenticatedUser));

    // Secure server-side cookie setting
    await loginAction(authenticatedUser.email, authenticatedUser.workspaceId, authenticatedUser.id);

    setSession({
      user: authenticatedUser,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "authenticated",
    });
  };

  const register = async (name: string, email: string, password?: string) => {
    setSession((prev) => ({ ...prev, status: "loading" }));

    // Prepare for future backend API integration here
    // e.g. const res = await fetch("/api/v1/auth/register", { ... })
    await new Promise((resolve) => setTimeout(resolve, 800));

    const registeredUser: User = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      role: "workspace_admin",
      workspaceId: "ws-default",
    };

    localStorage.setItem("auth_session_user", JSON.stringify(registeredUser));

    // Secure server-side cookie setting
    await loginAction(registeredUser.email, registeredUser.workspaceId, registeredUser.id);

    setSession({
      user: registeredUser,
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
    <AuthContext.Provider value={{ session, login, register, logout, hasPermission }}>
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
