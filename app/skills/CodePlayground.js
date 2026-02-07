"use client";
import React, { useEffect, useState } from "react";
import "./CodePlayground.css";

export function CodePlayground({ questionsList }) {
  const [questions, setQuestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [output, setOutput] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [shownAnswersMap, setShownAnswersMap] = useState({});

  useEffect(() => {
    if (questionsList) setQuestions(questionsList);
  }, [questionsList]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const ex = questions[selectedIndex];
    if (!ex) return;
    const isSingle = !!ex.issinglequestionanswer;
    const hasCode = ex.code != null && String(ex.code).trim() !== "";
    if (isSingle && !hasCode) setShowExplanation(true);
    else setShowExplanation(false);
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

  if (selectedIndex === null) {
    return (
      <div>
        <ul className="question-list">
          {questions.map((ex, i) => (
            <li key={i} onClick={() => setSelectedIndex(i)}>
              <div className="question-list-row">
                <div className="question-list-main">
                  <strong>Q{i + 1}:</strong> {ex.title}
                </div>

                {ex.issinglequestionanswer && (
                  <div className="question-list-action">
                    <button
                      className={`answer-link ${shownAnswersMap[i] ? "active" : ""
                        }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShownAnswersMap((m) => ({ ...m, [i]: !m[i] }));
                      }}
                    >
                      {shownAnswersMap[i] ? "Hide Answer" : "Show Answer"}
                    </button>
                  </div>
                )}
              </div>

              {ex.issinglequestionanswer && shownAnswersMap[i] && (
                <div className="inline-explanation">
                  {ex.explanation}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

    );
  }

  const ex = questions[selectedIndex];
  const isSingle = !!ex.issinglequestionanswer;

  const hasCode = ex.code != null && String(ex.code).trim() !== "";

  console.log("hasCode", hasCode)

  return (
    <div>
      {/* Header */}
      <div className="question-details-header">
        <h3>
          Q{selectedIndex + 1}: {ex.title}
        </h3>

        <div className="action-buttons">
          {hasCode && (
            <button className="btn" onClick={() => runCode(ex.code)}>
              Run
            </button>
          )}

          {hasCode && <button className="btn" onClick={() => setShowExplanation(!showExplanation)}>
            {showExplanation ? "Hide Answer" : "Show Answer"}
          </button>}

        </div>
      </div>

      {hasCode &&
        <textarea
          value={ex.code}
          onChange={(e) => {
            const updated = [...questions];
            updated[selectedIndex].code = e.target.value;
            setQuestions(updated);
          }}
        />
      }

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


      </div>
    </div>
  );
}

