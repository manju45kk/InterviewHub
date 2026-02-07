import "./globals.css";

import ToastProvider from "./ToastProvider"
import LayoutClient from "./LayoutClient"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
