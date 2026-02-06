"use client";
import React, { useState } from "react";
import "./CodePlayground.css";

/* ======================
   Utils
====================== */
const isEmpty = (v) =>
  v === null ||
  v === undefined ||
  (typeof v === "string" && v.trim() === "");

export function CodePlayground({ questionsList = [], onBackToConcept }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [expandedMap, setExpandedMap] = useState({});

  /* ======================
     Toggle panel (NO EFFECTS)
  ====================== */
  const togglePanel = (index) => {
    setExpandedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  /* ======================
     LIST VIEW
  ====================== */
  if (selectedIndex === null) {
    return (
      <div className="app">
        <ul className="question-list">
          {questionsList.map((q, index) => {
            if (!q) return null;

            const isSingle = q.isSingleQuestionAnswer === true;
            const isExpanded = !!expandedMap[index];

            return (
              <li key={index} className="question-item">
                {/* QUESTION TITLE → DETAILS PAGE */}
                <div
                  className="question-title"
                  onClick={() => setSelectedIndex(index)}
                >
                  <strong>Q{index + 1}:</strong>{" "}
                  {q.title || "Untitled Question"}
                </div>

                {/* PANEL TOGGLE */}
                {isSingle && !isEmpty(q.explanation) && (
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={(e) => {
                      e.stopPropagation(); // 🚨 critical
                      togglePanel(index);
                    }}
                  >
                    {isExpanded ? "Hide Answer" : "Show Answer"}
                  </button>
                )}

                {/* PANEL CONTENT */}
                {isSingle && isExpanded && (
                  <div className="panel-answer">
                    {q.explanation}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="footer-actions">
          <button className="btn" onClick={onBackToConcept}>
            ⬅ Back
          </button>
        </div>
      </div>
    );
  }

  /* ======================
     DETAILS VIEW
  ====================== */
  const q = questionsList[selectedIndex];

  if (!q) return null;

  return (
    <div className="app">
      <div className="question-details-header">
        <h3>
          Q{selectedIndex + 1}: {q.title}
        </h3>
      </div>

      {!isEmpty(q.explanation) && (
        <div className="explanation">
          {q.explanation}
        </div>
      )}

      <div className="question-details-footer">
        <button
          className="btn"
          disabled={selectedIndex === 0}
          onClick={() => setSelectedIndex((i) => i - 1)}
        >
          ⬅ Previous
        </button>

        <button
          className="btn"
          disabled={selectedIndex === questionsList.length - 1}
          onClick={() => setSelectedIndex((i) => i + 1)}
        >
          Next ➡
        </button>

        <button className="btn" onClick={() => setSelectedIndex(null)}>
          Back
        </button>
      </div>
    </div>
  );
}
