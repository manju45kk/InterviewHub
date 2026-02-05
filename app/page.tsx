"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "./home.css";

const InterviewHubHero = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/skills");
  };

  return (
    <div className="page">
      <div className="card">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
          alt="Interview preparation"
          className="hero-image"
        />

        <h1 className="title">Welcome to Interview Hub</h1>

        <p className="subtitle">
          Your one-stop platform to crack React, Frontend & Full-Stack interviews
        </p>

        <button className="cta-button" onClick={handleClick}>
          Click here
        </button>
      </div>
    </div>
  );
};

export default InterviewHubHero;
