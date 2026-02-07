"use client";
import React, { useEffect, useState } from "react";
import "./skills.css";
import { CodePlayground } from "./CodePlayground";
import Breadcrumb from "../../components/Breadcrumb";

function SkillGrid({ skills, onSelect }) {
  return (
    <div className="skill-container">
      {skills.map((skill) => (
        <div
          key={skill}
          className="skill-card"
          onClick={() => onSelect(skill)}
        >
          {skill}
        </div>
      ))}
    </div>
  );
}

function ConceptsList({ concepts, onSelectConcept }) {
  return (
    <div className="skill-page">
      
      <div className="skill-container">
        {concepts.map((concept) => (
          <div
            key={concept}
            className="skill-card"
            onClick={() => onSelectConcept(concept)}
          >
            {concept}
          </div>
        ))}
      </div>
    </div>
  );
}

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

  /* ---------- Skill Grid and Concepts usage moved to top-level components ---------- */

  /* ---------- Render ---------- */
  const breadcrumbItems = (() => {
    const skillsItem = {
      label: "Skills",
      onClick: () => {
        setSelectedSkill(null);
        setConcepts([]);
        setSelectedConcept(null);
        setPage("skills");
      },
    };

    if (page === "skills") return [{ label: "Skills" }];

    if (page === "concepts") {
      return [skillsItem, { label: selectedSkill || "" }, { label: "Concepts" }];
    }

    if (page === "questions") {
      return [
        skillsItem,
        {
          label: selectedSkill || "",
          onClick: () => {
            setSelectedConcept(null);
            setPage("concepts");
          },
        },
        { label: selectedConcept || "" },
      ];
    }

    return [skillsItem];
  })();

  return (
    <>
      <div className="breadcrumb-container">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {page === "skills" && (
        <SkillGrid
          skills={skills}
          onSelect={(skill) => {
            setSelectedSkill(skill);
            setPage("concepts");
          }}
        />
      )}
      {page === "concepts" && (
        <ConceptsList
          selectedSkill={selectedSkill}
          concepts={concepts}
          onSelectConcept={(concept) => {
            setSelectedConcept(concept);
            setPage("questions");
          }}
          onBack={() => {
            setSelectedSkill(null);
            setConcepts([]);
            setPage("skills");
          }}
        />
      )}
      {page === "questions" && (
        <CodePlayground
          questionsList={questions}
          onBackToConcept={() => setPage("concepts")}
        />
      )}
    </>
  );
}
