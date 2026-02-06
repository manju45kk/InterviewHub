"use client";
import React, { useState } from "react";
import "./admin.css";

const SKILLS_DATA = {
  JavaScript: ["Closure", "Functions", "Arrays", "Promises"],
  React: ["Hooks", "State", "Props"],
  CSS: ["Flexbox", "Grid"],
};

export default function AddQuestion() {
  const [section, setSection] = useState("home");
  // home | questions | single | bulk | simple

  /* ---------------- COMMON FORM STATE ---------------- */
  const [form, setForm] = useState({
    skill: "",
    concept: "",
    title: "",
    code: "",
    explanation: "",
  });

  const [jsonText, setJsonText] = useState("");

  const concepts = form.skill ? SKILLS_DATA[form.skill] : [];

  const resetForm = () =>
    setForm({
      skill: "",
      concept: "",
      title: "",
      code: "",
      explanation: "",
    });

  /* ---------------- SINGLE QUESTION ---------------- */
  const handleSingleSave = async () => {
    const { skill, concept, title, code, explanation } = form;
    if (!skill || !concept || !title || !code || !explanation) {
      alert("All fields are mandatory");
      return;
    }

    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Question saved");
    resetForm();
    setSection("questions");
  };

  /* ---------------- BULK QUESTIONS ---------------- */
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
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();
      alert("Bulk questions saved");
      setJsonText("");
      setSection("questions");
    } catch {
      alert("Invalid JSON");
    }
  };

  /* ---------------- SIMPLE QUESTION + ANSWER ---------------- */
  const handleSimpleSave = async () => {
    const { skill, concept, title, explanation } = form;

    if (!skill || !concept || !title || !explanation) {
      alert("All fields are mandatory");
      return;
    }

    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skill,
        concept,
        title,
        explanation,
        isSingleQuestionAnswer: true,
      }),
    });

    alert("Simple question saved");
    resetForm();
    setSection("questions");
  };

  /* ================= UI ================= */
  return (
    <div className="form-container">

      {/* ================= HOME ================= */}
      {section === "home" && (
        <>
          <h2 className="form-title">Admin Panel</h2>
          <button className="btn" onClick={() => setSection("questions")}>Questions</button>
          <button className="btn" disabled>Users</button>
          <button className="btn" disabled>Roles</button>

        </>
      )}

      {/* ================= QUESTIONS MENU ================= */}
      {section === "questions" && (
        <>
          <h2 className="form-title">Questions</h2>
          <button className="btn" onClick={() => setSection("single")}>➕ Add Single Question</button>
          <button className="btn" onClick={() => setSection("bulk")}>⬆ Add Bulk Questions</button>
          <button className="btn" onClick={() => setSection("simple")}>✍ Add Simple Q&A</button>
          <button className="btn cancel-btn" onClick={() => setSection("home")}>← Back</button>
        </>
      )}

      {/* ================= SINGLE FORM ================= */}
      {section === "single" && (
        <>
          <h2 className="form-title">Add Single Question</h2>

          <select className="input" value={form.skill}
            onChange={(e) => setForm({ ...form, skill: e.target.value, concept: "" })}>
            <option value="">Select Skill</option>
            {Object.keys(SKILLS_DATA).map(s => <option key={s}>{s}</option>)}
          </select>

          <select className="input" value={form.concept}
            disabled={!form.skill}
            onChange={(e) => setForm({ ...form, concept: e.target.value })}>
            <option value="">Select Concept</option>
            {concepts.map(c => <option key={c}>{c}</option>)}
          </select>

          <input className="input" placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <textarea className="textarea code-area" placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })} />

          <textarea className="textarea" placeholder="Explanation"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })} />

          <div className="button-row">
            <button className="btn add-btn" onClick={handleSingleSave}>Save</button>
            <button className="btn cancel-btn" onClick={() => setSection("questions")}>← Back</button>
          </div>
        </>
      )}

      {/* ================= BULK ================= */}
      {section === "bulk" && (
        <>
          <h2 className="form-title">Bulk Questions Upload</h2>
          <textarea className="textarea" value={jsonText}
            onChange={(e) => setJsonText(e.target.value)} />
          <div className="button-row">
            <button className="btn add-btn" onClick={handleBulkSave}>Save Questions</button>
            <button className="btn cancel-btn" onClick={() => setSection("questions")}>← Back</button>
          </div>
        </>
      )}

      {/* ================= SIMPLE Q&A ================= */}
      {section === "simple" && (
        <>
          <h2 className="form-title">Add Simple Question & Answer</h2>

          <select className="input" value={form.skill}
            onChange={(e) => setForm({ ...form, skill: e.target.value, concept: "" })}>
            <option value="">Select Skill</option>
            {Object.keys(SKILLS_DATA).map(s => <option key={s}>{s}</option>)}
          </select>

          <select className="input" value={form.concept}
            disabled={!form.skill}
            onChange={(e) => setForm({ ...form, concept: e.target.value })}>
            <option value="">Select Concept</option>
            {concepts.map(c => <option key={c}>{c}</option>)}
          </select>

          <input className="input" placeholder="Question Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <textarea className="textarea" placeholder="Answer"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })} />

          <div className="button-row">
            <button className="btn add-btn" onClick={handleSimpleSave}>Save</button>
            <button className="btn cancel-btn" onClick={() => setSection("questions")}>← Back</button>
          </div>
        </>
      )}
    </div>
  );
}
