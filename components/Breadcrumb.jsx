"use client";

import React from "react";
import "./breadcrumb.css";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="breadcrumb" className="breadcrumb">
      {items.map((it, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span
            key={idx}
            className={`crumb ${it.onClick ? "clickable" : isLast ? "active" : ""}`}
            onClick={it.onClick}
            role={it.onClick ? "button" : undefined}
            tabIndex={it.onClick ? 0 : undefined}
            onKeyDown={e => { if (it.onClick && (e.key === 'Enter' || e.key === ' ')) it.onClick(); }}
          >
            {it.label}
            {!isLast && <span className="sep"> / </span>}
          </span>
        );
      })}
    </nav>
  );
}
