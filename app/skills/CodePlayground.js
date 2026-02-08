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

  return code
    .replace(/;/g, ';\n')
    .replace(/{/g, '{\n')
    .replace(/}/g, '\n}\n')
    .replace(/\n\s*\n/g, '\n')
    .trim();
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
      new Function(code)();
      setOutput(logs || "✅ Code executed with no output.");
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
              <strong>Q{i + 1}:</strong> {ex.title}

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
      <h3>
        Q{selectedIndex + 1}: {ex.title}
      </h3>

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
