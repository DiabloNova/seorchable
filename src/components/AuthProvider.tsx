"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session, UserRole } from "@/types/auth";
import { loginAction, logoutAction, getServerSessionAction } from "@/app/actions/auth";

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
    // Check the authoritative server-side session first
    getServerSessionAction()
      .then((serverSession) => {
        if (serverSession.status === "authenticated" && serverSession.user) {
          // Synchronize local storage with the authoritative server identity
          localStorage.setItem("auth_session_user", JSON.stringify(serverSession.user));
          setSession(serverSession);
        } else {
          // If no server session, clear client-controlled identity completely (fail closed)
          localStorage.removeItem("auth_session_user");
          setSession({
            user: null,
            expiresAt: null,
            status: "unauthenticated",
          });
        }
      })
      .catch((err) => {
        console.error("Failed to fetch authoritative server session:", err);
        // Fallback safely to unauthenticated to prevent unauthorized layout bypass
        localStorage.removeItem("auth_session_user");
        setSession({
          user: null,
          expiresAt: null,
          status: "unauthenticated",
        });
      });
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
      id: `usr-${Math.random().toString(36).substring(2, 11)}`,
      name: name || "Enterprise User",
      email,
      role: "workspace_admin",
      workspaceId: "ws-default",
    };

    // Secure server-side cookie setting with authoritative signed session
    await loginAction(authenticatedUser);

    localStorage.setItem("auth_session_user", JSON.stringify(authenticatedUser));

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
      id: `usr-${Math.random().toString(36).substring(2, 11)}`,
      name,
      email,
      role: "workspace_admin",
      workspaceId: "ws-default",
    };

    // Secure server-side cookie setting with authoritative signed session
    await loginAction(registeredUser);

    localStorage.setItem("auth_session_user", JSON.stringify(registeredUser));

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
