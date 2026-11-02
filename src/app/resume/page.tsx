"use client";

import "./resume.css";
import { ArrowLeft, Download } from "lucide-react";
import { education, experience, leadership, profile, projects, skills } from "@/data/portfolio";

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="resume-toolbar">
        <a href="/" className="resume-back"><ArrowLeft size={15}/> Back to portfolio</a>
        <button onClick={() => window.print()} className="resume-print"><Download size={14}/> Print / Save PDF</button>
      </div>
      <article className="resume-sheet">
        <header className="resume-header">
          <div><h1>{profile.name}</h1><p>{profile.role} · Hyderabad, India</p></div>
          <div className="resume-contacts">
            <a href={"mailto:" + profile.email}>{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/krishitaliya</a>
            <a href={profile.github} target="_blank" rel="noreferrer">github.com/krish-italiya</a>
          </div>
        </header>
        <section className="resume-section">
          <h2>EXPERIENCE</h2>
          {experience.map((item) => <div className="resume-entry" key={item.role + item.period}>
            <div className="resume-entry-top"><strong>{item.role}</strong><span>{item.period}</span></div>
            <div className="resume-entry-sub">{item.company} · {item.location}</div>
            <ul>{item.highlights.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>)}
        </section>
        <section className="resume-section">
          <h2>PROJECTS</h2>
          {projects.slice(0, 3).map((project) => <div className="resume-entry" key={project.id}>
            <div className="resume-entry-top"><strong>{project.name}</strong><span>{project.stack.slice(0, 4).join(" · ")}</span></div>
            <p>{project.summary}</p>
          </div>)}
        </section>
        <section className="resume-section">
          <h2>LEADERSHIP</h2>
          <div className="resume-entry">
            <div className="resume-entry-top"><strong>{leadership.role} · {leadership.organization}</strong><span>{leadership.period}</span></div>
            <p>{leadership.detail}</p>
          </div>
        </section>
        <section className="resume-section">
          <h2>EDUCATION</h2>
          <div className="resume-entry">
            <div className="resume-entry-top"><strong>{education.degree}</strong><span>{education.period}</span></div>
            <p>{education.institution} · CGPA {education.result}/10 · {education.location}</p>
          </div>
        </section>
        <section className="resume-section">
          <h2>TECHNICAL SKILLS</h2>
          {skills.map((group) => <p className="resume-skill" key={group.group}><strong>{group.group}:</strong> {group.items.join(", ")}</p>)}
        </section>
        <p className="resume-foot">Generated from the portfolio content · Verify all details before distributing.</p>
      </article>
    </main>
  );
}
