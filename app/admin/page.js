"use client";
import React, { useState } from "react";
import "./admin.css";

const SKILLS_DATA = {
  JavaScript: ["Closure", "Functions", "Strings", "Arrays", "Hoisting"],
  React: ["Hooks", "State", "Props", "Lifecycle"],
  CSS: ["Flexbox", "Grid", "Positioning"],
};

export default function AddQuestion({ onCancel }) {
  const [mode, setMode] = useState("single"); // single | bulk

  const [form, setForm] = useState({
    skill: "",
    concept: "",
    title: "",
    code: "",
    explanation: "",
  });

  const [jsonText, setJsonText] = useState("");

  const concepts = form.skill ? SKILLS_DATA[form.skill] : [];

  // ---------------- SINGLE SAVE ----------------
  const handleAdd = async () => {
    const { skill, concept, title, code, explanation } = form;
    if (!skill || !concept || !title || !code || !explanation) {
      alert("Please fill all fields");
      return;
    }

    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Question saved");

    setForm({
      skill: "",
      concept: "",
      title: "",
      code: "",
      explanation: "",
    });
  };

  // ---------------- BULK SAVE ----------------
  const handleBulkSave = async () => {
    try {
      const data = JSON.parse(jsonText);

      if (!Array.isArray(data)) {
        alert("JSON must be an array");
        return;
      }

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data) // ✅ raw array
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Bulk save failed");
        return;
      }

      alert(`Saved ${result.count} questions`);
      setJsonText("");
      setMode("single");
    } catch (err) {
      alert("Invalid JSON");
    }
  };


  return (
    <div className="form-container">
      {/* ================= SINGLE FORM ================= */}
      {mode === "single" && (
        <>
          <h2 className="form-title">Add New Question</h2>

          <select
            className="input"
            value={form.skill}
            onChange={(e) =>
              setForm({ ...form, skill: e.target.value, concept: "" })
            }
          >
            <option value="">Select Skill</option>
            {Object.keys(SKILLS_DATA).map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={form.concept}
            disabled={!form.skill}
            onChange={(e) =>
              setForm({ ...form, concept: e.target.value })
            }
          >
            <option value="">Select Concept</option>
            {concepts.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Question Title"
            className="input"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Code Snippet"
            className="textarea code-area"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value })
            }
          />

          <textarea
            placeholder="Explanation"
            className="textarea"
            value={form.explanation}
            onChange={(e) =>
              setForm({ ...form, explanation: e.target.value })
            }
          />

          <div className="button-row">
            <button className="btn add-btn" onClick={handleAdd}>
              + Save Question
            </button>

            <button
              className="btn"
              onClick={() => setMode("bulk")}
            >
              ⬆ Upload JSON (Questions)
            </button>

            <button className="btn cancel-btn" onClick={onCancel}>
              ✖ Cancel
            </button>
          </div>
        </>
      )}

      {/* ================= BULK UPLOAD ================= */}
      {mode === "bulk" && (
        <>
          <h2 className="form-title">Upload Questions (JSON)</h2>

          <textarea
            className="textarea"
            placeholder="Paste JSON array here"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />

          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (ev) =>
                setJsonText(ev.target.result);
              reader.readAsText(file);
            }}
          />

          <div className="button-row">
            <button
              className="btn add-btn"
              onClick={handleBulkSave}
            >
              ✔ Save All
            </button>

            <button
              className="btn cancel-btn"
              onClick={() => {
                setJsonText("");
                setMode("single");
              }}
            >
              ⬅ Back
            </button>
          </div>
        </>
      )}
    </div>
  );
}
