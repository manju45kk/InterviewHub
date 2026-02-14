"use client";
import React, { useEffect, useState } from "react";
import "./CodePlayground.css";

export function CodePlayground({ questionsList }) {
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [output, setOutput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [shownAnswersMap, setShownAnswersMap] = useState({});

  function formatCode(code) {
    if (!code) return code;

    let formatted = "";
    let indentLevel = 0;
    const indentStr = "  "; // 2 spaces per indent
    let lineContent = "";

    // Normalize whitespace
    code = code.replace(/\s+/g, " ");

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if (char === "{") {
        lineContent = lineContent.trim();
        if (lineContent) {
          formatted += indentStr.repeat(indentLevel) + lineContent + " {\n";
        } else {
          formatted += "{\n";
        }
        indentLevel++;
        lineContent = "";
      } else if (char === "}") {
        if (lineContent.trim()) {
          formatted += indentStr.repeat(indentLevel) + lineContent.trim() + ";\n";
        }
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += indentStr.repeat(indentLevel) + "}\n";
        lineContent = "";
      } else if (char === ";") {
        lineContent = lineContent.trim();
        if (lineContent) {
          formatted += indentStr.repeat(indentLevel) + lineContent + ";\n";
        }
        lineContent = "";
      } else {
        lineContent += char;
      }
    }

    // Handle any remaining content
    if (lineContent.trim()) {
      formatted += indentStr.repeat(indentLevel) + lineContent.trim();
    }

    return formatted.trim();
  }

   useEffect(() => {
    if (!questionsList) return;

    // 🔥 FORMAT CODE HERE (ONLY ON LOAD)
    const formatted = questionsList.map((q) => ({
      ...q,
      code: q.code ? formatCode(String(q.code)) : q.code,
    }));

    setQuestions(formatted);
  }, [questionsList]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const ex = questions[selectedIndex];
    if (!ex) return;

    const isSingle = !!ex.issinglequestionanswer;
    const hasCode = ex.code && ex.code.trim() !== "";

    // Auto show explanation ONLY when single question without code
    setShowExplanation(isSingle && !hasCode);
  }, [selectedIndex, questions]);

  const runCode = (code) => {
    let logs = "";
    const originalLog = console.log;

    try {
      console.log = (...args) => (logs += args.join(" ") + "\n");
      const result = new Function(code)();
      
      // Show console output if available, otherwise show success or result
      if (logs) {
        setOutput(logs);
      } else if (result !== undefined) {
        setOutput(String(result));
      } else {
        setOutput("✅ Code executed successfully.");
      }
    } catch (e) {
      setOutput("❌ Error: " + e.message);
    } finally {
      console.log = originalLog;
    }
  };

  /* ================= LIST VIEW ================= */
  if (selectedIndex === null) {
    return (
      <ul className="question-list">
        {questions.map((ex, i) => (
          <li key={i} onClick={() => setSelectedIndex(i)}>
            <div className="question-list-row">
              {ex.issinglequestionanswer && (
                <button
                  className="answer-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShownAnswersMap((m) => ({ ...m, [i]: !m[i] }));
                  }}
                >
                 {shownAnswersMap[i] ? "🙈" : "👁️"}
                </button>
              )}
              <div className="question-list-main">
                <strong>Q{i + 1}:</strong> {ex.title}
              </div>
            </div>

            {ex.issinglequestionanswer && shownAnswersMap[i] && (
              <div
                className="inline-explanation"
                dangerouslySetInnerHTML={{ __html: ex.explanation }}
              />
            )}
          </li>
        ))}
      </ul>
    );
  }

  /* ================= DETAIL VIEW ================= */
  const ex = questions[selectedIndex];
  const hasCode = ex.code && ex.code.trim() !== "";

  return (
    <div className="question-detail">
      <h4>
        Q{selectedIndex + 1}: {ex.title}
   </h4>

      {/* ✅ EDITABLE & READABLE CODE */}
      {hasCode && (
        <textarea
          className="code-textarea"
          value={ex.code}
          spellCheck={false}
          wrap="off"
          onChange={(e) => {
            const updated = [...questions];
            updated[selectedIndex].code = e.target.value;
            setQuestions(updated);
            setOutput(""); // Clear output when code changes
          }}
        />
      )}

      {output && <pre className="output">{output}</pre>}

      {showExplanation && (
        <div
          className="explanation"
          dangerouslySetInnerHTML={{ __html: ex.explanation }}
        />
      )}

   
      <div className="question-details-footer">
        <div className="nav-buttons">
          <button
            className="btn"
            disabled={selectedIndex === 0}
            onClick={() => {
              setSelectedIndex(selectedIndex - 1);
              setOutput(""); // Clear output when navigating
            }}
          >
            ⬅ Previous
          </button>

          <button
            className="btn"
            disabled={selectedIndex === questions.length - 1}
            onClick={() => {
              setSelectedIndex(selectedIndex + 1);
              setOutput(""); // Clear output when navigating
            }}
          >
            Next ➡
          </button>
        </div>
        <div className="action-buttons">
          {hasCode && <button className="btn" onClick={() => setShowExplanation(!showExplanation)}>
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>}

          {hasCode && (
            <button className="btn" onClick={() => runCode(ex.code)}>
              Run Code
            </button>
          )}


        </div>

      </div>
    </div>
  );
}
