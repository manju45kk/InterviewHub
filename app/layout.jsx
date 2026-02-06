"use client";

import "./globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
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

  return (
    <html lang="en">
      <body>
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
              <div className="profile-circle">M</div>
              <span className="username">Manju</span>
            </div>
          </div>

          {/* Main */}
          <div className="main">
            <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
              <Link href="/skills" className="nav-link">Skills</Link>
              <Link href="/settings" className="nav-link">Settings</Link>
              <Link href="/admin" className="nav-link">Admin</Link>
            </nav>

            <div className="content" onClick={() => setMenuOpen(false)}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
