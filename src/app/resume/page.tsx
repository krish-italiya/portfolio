"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { education, experience, leadership, profile, projects, skills, achievements } from "@/data/portfolio";

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="resume-toolbar">
        <Link href="/" className="resume-back"><ArrowLeft size={15} /> Back to portfolio</Link>
        <button onClick={() => window.print()} className="resume-print"><Download size={14} /> Print / Save PDF</button>
      </div>
      <article className="resume-sheet">
        <header className="resume-header">
          <div><h1>{profile.name}</h1><p>{profile.role} · {profile.location}</p></div>
          <div className="resume-contacts">
            <a href={"mailto:" + profile.email}>{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/krishitaliya</a>
            <a href={profile.github} target="_blank" rel="noreferrer">github.com/krish-italiya</a>
          </div>
        </header>
        <section className="resume-section">
          <h2>EXPERIENCE</h2>
          {experience.map((item) => <div className="resume-entry" key={item.company}>
            <div className="resume-entry-top"><strong>{item.company}</strong><span>{item.period}</span></div>
            <div className="resume-entry-sub">{item.location}</div>
            {item.roles.map((role) => <p key={role.title}><strong>{role.title}</strong> · {role.period}</p>)}
            <ul>{item.highlights.map((point) => <li key={point}>{point}</li>)}</ul>
          </div>)}
        </section>
        <section className="resume-section">
          <h2>PROJECTS</h2>
          {projects.map((project) => <div className="resume-entry" key={project.id}>
            <div className="resume-entry-top"><strong>{project.name}</strong><span>{project.stack.slice(0, 4).join(" · ")}</span></div>
            <p>{project.description}</p>
          </div>)}
        </section>
        <section className="resume-section">
          <h2>EDUCATION</h2>
          <div className="resume-entry"><div className="resume-entry-top"><strong>{education.degree}</strong><span>{education.period}</span></div><p>{education.institution} · CGPA {education.result} · {education.location}</p></div>
        </section>
        <section className="resume-section">
          <h2>LEADERSHIP</h2>
          <div className="resume-entry"><div className="resume-entry-top"><strong>{leadership.role} · {leadership.organization}</strong><span>{leadership.period}</span></div><p>{leadership.detail}</p></div>
        </section>
        <section className="resume-section">
          <h2>ACHIEVEMENTS</h2>
          {achievements.map((item) => <p className="resume-skill" key={item.label}><strong>{item.label}:</strong> {item.value} · {item.detail}</p>)}
        </section>
        <section className="resume-section">
          <h2>TECHNICAL SKILLS</h2>
          {skills.map((group) => <p className="resume-skill" key={group.group}><strong>{group.group}:</strong> {group.items.join(", ")}</p>)}
        </section>
        <p className="resume-foot">Generated from the portfolio content. Confirm details before distributing externally.</p>
      </article>
    </main>
  );
}
