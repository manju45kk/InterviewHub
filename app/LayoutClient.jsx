"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";
import ToastProvider from "./ToastProvider";

function LayoutContent({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const { data: session } = useSession();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.remove("light", "dark");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  const userInitial = session?.user?.username?.[0]?.toUpperCase() || "U";

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <span
            className="menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </span>
          IT Hub
        </div>

        <div className="header-right">
          <button className="theme-btn" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <div className="profile-circle">{userInitial}</div>
          <span className="username">{session?.user?.username || "Guest"}</span>
          {session && (
            <button
              className="theme-btn"
              onClick={handleLogout}
              title="Logout"
              style={{ fontSize: "18px" }}
            >
              🚪
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
          <Link href="/skills" className="nav-link">Skills</Link>
          <Link href="/settings" className="nav-link">Settings</Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="nav-link">Admin</Link>
          )}
        </nav>

        <div className="content" onClick={() => setMenuOpen(false)}>
          <ToastProvider />
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LayoutClient({ children }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}
