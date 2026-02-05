import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          {/* Header */}
          <div className="header">
            <div className="header-left">IT Hub</div>

            <div className="header-right">
              <div className="profile-circle">M</div>
              <span className="username">Manju</span>
            </div>
          </div>

          {/* Main Section */}
          <div className="main">
            {/* Sidebar */}
            <nav className="sidebar">
              <Link href="/skills" className="nav-link">Skills</Link>
              <Link href="/users" className="nav-link">Users</Link>
              <Link href="/admin" className="nav-link">Admin</Link>
            </nav>

            {/* Content */}
            <div className="content">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
