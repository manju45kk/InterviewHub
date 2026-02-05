"use client";
import React, { useEffect, useState } from "react";
import "./CodePlayground.css";

export function CodePlayground({ questionsList, onBackToConcept }) {
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [output, setOutput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (questionsList) setQuestions(questionsList);
  }, [questionsList]);

  const runCode = (code) => {
    let logs = "";
    const originalLog = console.log;
    try {
      console.log = (...args) => (logs += args.join(" ") + "\n");
      new Function(code)();
      setOutput(logs || "✅ Code executed with no output.");
    } catch (e) {
      setOutput("❌ Error: " + e.message);
    } finally {
      console.log = originalLog;
    }
  };

  if (selectedIndex === null) {
    return (
      <div className={dark ? "app dark" : "app"}>
        <ul className="question-list">
          {questions.map((ex, i) => (
            <li key={i} onClick={() => setSelectedIndex(i)}>
              <strong>Q{i + 1}:</strong> {ex.title}
            </li>
          ))}
        </ul>

        <div className="footer-actions">
          <button className="btn" onClick={onBackToConcept}>
            ⬅ Back
          </button>
        </div>
      </div>
    );
  }

  const ex = questions[selectedIndex];

  return (
    <div className={dark ? "app dark" : "app"}>
      {/* Header */}
      <div className="question-details-header">
        <h3>
          Q{selectedIndex + 1}: {ex.title}
        </h3>

        <div className="action-buttons">
          <button className="btn" onClick={() => runCode(ex.code)}>Run</button>
          <button className="btn" onClick={() => setShowExplanation(!showExplanation)}>
            {showExplanation ? "Hide" : "Show"} Explanation
          </button>
          <button className="btn" onClick={() => setQuestions([...questionsList])}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <textarea
        value={ex.code}
        onChange={(e) => {
          const updated = [...questions];
          updated[selectedIndex].code = e.target.value;
          setQuestions(updated);
        }}
      />

      {output && <pre className="output">{output}</pre>}
      {showExplanation && <div className="explanation">{ex.explanation}</div>}

      {/* Footer */}
      <div className="question-details-footer">
        <div className="nav-buttons">
          <button
            className="btn"
            disabled={selectedIndex === 0}
            onClick={() => setSelectedIndex(selectedIndex - 1)}
          >
            ⬅ Previous
          </button>

          <button
            className="btn"
            disabled={selectedIndex === questions.length - 1}
            onClick={() => setSelectedIndex(selectedIndex + 1)}
          >
            Next ➡
          </button>
        </div>

        <button className="btn" onClick={() => setSelectedIndex(null)}>
          Back
        </button>
      </div>
    </div>
  );
}
