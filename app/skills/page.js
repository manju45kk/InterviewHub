"use client";
import React, { useEffect, useState } from "react";
import "./skills.css";
import  {CodePlayground}  from "./CodePlayground";

export default function Skill() {
  const [page, setPage] = useState("skills");
  const [skills, setSkills] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedConcept, setSelectedConcept] = useState(null);

  /* ---------- Fetch Skills ---------- */
  useEffect(() => {
    if (page !== "skills") return;

    fetch("/api/questions?type=skills")
      .then((res) => res.json())
      .then((data) => setSkills(data.data || []))
      .catch(console.error);
  }, [page]);

  /* ---------- Fetch Concepts ---------- */
  useEffect(() => {
    if (!selectedSkill) return;

    fetch(`/api/questions?type=concepts&skill=${selectedSkill}`)
      .then((res) => res.json())
      .then((data) => setConcepts(data.data || []))
      .catch(console.error);
  }, [selectedSkill]);

  /* ---------- Fetch Questions ---------- */
  useEffect(() => {
    if (!selectedSkill || !selectedConcept) return;

    fetch(
      `/api/questions?type=questions&skill=${selectedSkill}&concept=${selectedConcept}`
    )
      .then((res) => res.json())
      .then((data) => setQuestions(data.data || []))
      .catch(console.error);
  }, [selectedSkill, selectedConcept]);

  /* ---------- Skill Grid ---------- */
  const SkillGrid = () => (
    <div className="skill-container">
      {skills.map((skill) => (
        <div
          key={skill}
          className="skill-card"
          onClick={() => {
            setSelectedSkill(skill);
            setPage("concepts");
          }}
        >
          {skill}
        </div>
      ))}
    </div>
  );

  /* ---------- Concepts List ---------- */
  const ConceptsList = () => (
    <div className="skill-page">

      <h2 style={{paddingBottom:'10px'}}>{selectedSkill} Concepts</h2>

      <div className="skill-container">
        {concepts.map((concept) => (
          <div
            key={concept}
            className="skill-card"
            onClick={() => {
              setSelectedConcept(concept);
              setPage("questions");
            }}
          >
            {concept}
          </div>
        ))}
      </div>

      <div className="skill-footer">
        <button
          className="btn"
          onClick={() => {
            setSelectedSkill(null);
            setConcepts([]);
            setPage("skills");
          }}
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );

  /* ---------- Render ---------- */
  return (
    <>
      {page === "skills" && <SkillGrid />}
      {page === "concepts" && <ConceptsList />}
      {page === "questions" && (
        <CodePlayground
          questionsList={questions}
          onBackToConcept={() => setPage("concepts")}
        />
      )}
    </>
  );
}
