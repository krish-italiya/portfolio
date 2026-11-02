"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Award, BriefcaseBusiness,
  Cloud, Code2, Database, ExternalLink, FileText, Github, GraduationCap,
  Layers3, Linkedin, Mail, Menu, Monitor, Send, Terminal, X, Check
} from "lucide-react";
import {
  achievements, education, experience, leadership, profile, projects, skills
} from "@/data/portfolio";
import { ThemeControl } from "@/components/providers";

const navItems = [
  ["Home", "#home"], ["Experience", "#experience"], ["Projects", "#projects"],
  ["Skills", "#skills"], ["Playground", "#playground"], ["About", "#about"], ["Contact", "#contact"]
];

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="section-heading">
      <div>
        <div className="section-eyebrow"><span />{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const elements = navItems.map(([, href]) => document.querySelector<HTMLElement>(href)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-22% 0px -63% 0px", threshold: [0, 0.15, 0.35, 0.6] });
    elements.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="page-width nav-inner">
          <a href="#home" className="brand" aria-label="Krish Italiya home">
            <span className="brand-symbol">KI<span>.</span></span>
            <span className="brand-copy"><strong>Krish Italiya</strong><small>SOFTWARE ENGINEER</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, href]) => <a href={href} key={href} className={active === href.slice(1) ? "active" : ""}>{label}</a>)}
          </nav>
          <div className="nav-actions">
            <a className="nav-social" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={17} /></a>
            <a className="nav-social" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
            <ThemeControl />
            <button type="button" className="mobile-menu-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map(([label, href]) => <a href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</a>)}
            <a href="/resume" className="mobile-resume">View résumé <ArrowUpRight size={14} /></a>
          </nav>
        )}
      </header>
    </>
  );
}

function ProjectArtwork({ id }: { id: string }) {
  if (id === "foundry") return (
    <div className="project-artwork foundry-art" aria-hidden="true">
      <div className="art-topbar"><i /><i /><i /><span>foundry / deployments</span></div>
      <div className="art-dashboard">
        <div className="art-sidebar"><b /><i /><i /><i /><i /></div>
        <div className="art-main">
          <div className="art-dash-title">Deployments <span>+</span></div>
          <div className="art-stat-row"><i /><i /><i /></div>
          <div className="art-table-row"><b /><i /><em /></div>
          <div className="art-table-row"><b /><i /><em /></div>
          <div className="art-table-row"><b /><i /><em /></div>
        </div>
      </div>
    </div>
  );
  if (id === "instacv") return (
    <div className="project-artwork cv-art" aria-hidden="true">
      <div className="art-topbar"><i /><i /><i /><span>instacv / editor</span></div>
      <div className="cv-split">
        <div className="cv-controls"><b /><i /><i /><i /><i /><i /></div>
        <div className="cv-paper"><b /><strong /><i /><i /><i /><i /><i /><em /></div>
      </div>
    </div>
  );
  if (id === "airbnb") return (
    <div className="project-artwork stays-art" aria-hidden="true">
      <div className="art-topbar"><i /><i /><i /><span>stays / explore</span></div>
      <div className="stays-content">
        <strong>Find your next stay</strong>
        <div className="stays-search"><i /><i /><i /></div>
        <div className="stays-grid"><i /><i /><i /></div>
      </div>
    </div>
  );
  return (
    <div className="project-artwork ipl-art" aria-hidden="true">
      <div className="art-topbar"><i /><i /><i /><span>IPL / analytics</span></div>
      <div className="ipl-content">
        <div className="ipl-title">Season insights</div>
        <div className="ipl-metrics"><i /><i /><i /></div>
        <div className="ipl-chart">{[32, 55, 44, 76, 62, 91, 49, 70, 58, 82, 39].map((height, i) => <i key={i} style={{ height: height + "%" }} />)}</div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <Reveal delay={(index % 2) * 0.07}>
      <article className="project-card">
        <a className="project-art-link" href={project.source} target="_blank" rel="noreferrer" aria-label={"View " + project.name + " source code"}>
          <ProjectArtwork id={project.id} />
          <span className="project-art-open"><ArrowUpRight size={17} /></span>
        </a>
        <div className="project-card-body">
          <div className="project-card-meta"><span>{project.number}</span><span>{project.category}</span></div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <div className="project-links">
            <a href={project.source} target="_blank" rel="noreferrer"><Github size={14} /> Source code <ArrowUpRight size={13} /></a>
            {project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Live app <ArrowUpRight size={13} /></a>}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ExperienceCard({ item, index }: { item: (typeof experience)[number]; index: number }) {
  return (
    <Reveal delay={index * 0.08}>
      <article className="experience-card">
        <div className="experience-card-head">
          <div className="company-mark">{item.company === "State Street Corporation" ? "SS" : "D360"}</div>
          <div className="company-heading">
            <div className="company-period">{item.period}</div>
            <h3>{item.company}</h3>
            <span>{item.location}</span>
          </div>
          {index === 0 && <span className="current-pill"><i /> CURRENT</span>}
        </div>
        <div className="experience-roles">
          {item.roles.map((role) => (
            <div className="experience-role" key={role.title}>
              <span className="role-marker" /><strong>{role.title}</strong><small>{role.period}</small>
            </div>
          ))}
        </div>
        <p className="experience-summary">{item.summary}</p>
        <ul className="experience-highlights">{item.highlights.map((point) => <li key={point}>{point}</li>)}</ul>
        <div className="project-tags experience-tags">{item.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </article>
    </Reveal>
  );
}

function TerminalPlayground() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<{ command: string; output: string }[]>([
    { command: "whoami", output: "Krish Italiya — Software Engineer at State Street." },
    { command: "focus", output: "Product engineering · Backend systems · Cloud infrastructure" },
    { command: "help", output: "Try: experience, projects, skills, education, contact, resume, clear" }
  ]);

  const commands: Record<string, string> = {
    help: "Available commands: whoami, focus, experience, projects, skills, education, contact, resume, clear",
    whoami: "Krish Italiya — Software Engineer at State Street Corporation, Hyderabad.",
    focus: "Product engineering · Backend systems · Cloud infrastructure · Problem solving",
    experience: "State Street (Jan 2025 — Present) · D360 Tech (Jun 2024 — Jul 2024). Scroll to Experience for details.",
    projects: "Foundry · InstaCV · Airbnb Clone · IPL Data Analysis. Scroll to Projects to explore each build.",
    skills: "Java · C++ · JavaScript · TypeScript · Python · React · Spring Boot · Oracle · MongoDB · GCP",
    education: "B.Tech Computer Science and Engineering, Institute of Technology, Nirma University — 8.31/10.",
    contact: "Email: krishitaliya11@gmail.com · LinkedIn: linkedin.com/in/krishitaliya",
    resume: "Open the résumé using the View résumé link in the navigation.",
    clear: ""
  };

  const runCommand = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      setHistory([]);
      setInput("");
      return;
    }
    const output = commands[command] ?? "Command not found. Type 'help' to see the available commands.";
    setHistory((items) => [...items.slice(-7), { command: raw.trim(), output }]);
    setInput("");
  };

  return (
    <div className="terminal-window">
      <div className="terminal-topbar">
        <div className="terminal-dots"><i /><i /><i /></div>
        <div className="terminal-tab"><Terminal size={13} /> krish@portfolio <span>⌄</span></div>
        <span className="terminal-mode">INTERACTIVE PROFILE</span>
      </div>
      <div className="terminal-content" aria-live="polite">
        {history.map((entry, index) => (
          <div className="terminal-entry" key={index}>
            <div className="terminal-command"><span>$</span> {entry.command}</div>
            <div className="terminal-output">{entry.output}</div>
          </div>
        ))}
        <form className="terminal-input-row" onSubmit={(event) => { event.preventDefault(); runCommand(input); }}>
          <span>$</span>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="type a command..." aria-label="Type a portfolio terminal command" autoComplete="off" spellCheck={false} />
          <button type="submit" aria-label="Run command"><ArrowRight size={15} /></button>
        </form>
      </div>
      <div className="terminal-suggestions">
        <span>TRY</span>
        {["experience", "projects", "skills", "contact"].map((command) => <button type="button" key={command} onClick={() => runCommand(command)}>{command}</button>)}
      </div>
    </div>
  );
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = "mailto:" + profile.email;
    }
  };
  return <button type="button" className="button button-secondary" onClick={copy}>{copied ? <Check size={15} /> : <Mail size={15} />}{copied ? "Copied email" : "Copy email"}</button>;
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="site-shell">
        <Header />

        <section id="home" className="page-width hero-section">
          <div className="hero-copy">
            <motion.div className="hero-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="availability-dot" /> SOFTWARE ENGINEER <i /> FULL-STACK <i /> CLOUD
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}>
              Hi, I’m<br /><span>Krish Italiya.</span>
            </motion.h1>
            <motion.p className="hero-description" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18 }}>
              {profile.tagline} {profile.introduction}
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.28 }}>
              <a href="#projects" className="button button-primary">View projects <ArrowDownRight size={16} /></a>
              <a href="/resume" className="button button-secondary"><FileText size={15} /> View résumé</a>
            </motion.div>
            <motion.div className="hero-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42, duration: 0.55 }}>
              <span><BriefcaseBusiness size={14} /> {profile.currentRole}</span><i /><span><Cloud size={14} /> {profile.location}</span>
            </motion.div>
          </div>

          <motion.div className="hero-portrait" initial={{ opacity: 0, y: 28, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}>
            <div className="portrait-backplate" />
            <div className="portrait-orbit portrait-orbit-one" />
            <div className="portrait-orbit portrait-orbit-two" />
            <Image src="/krish-italiya.webp" alt="Krish Italiya wearing a dark charcoal jacket" width={360} height={566} priority data-critical="true" className="portrait-image" sizes="(max-width: 760px) 78vw, (max-width: 1100px) 42vw, 410px" />
            <div className="portrait-caption"><span>KRISH ITALIYA</span><small>SOFTWARE ENGINEER · HYDERABAD</small></div>
          </motion.div>

          <motion.aside className="hero-facts" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.65, delay: 0.32 }}>
            <div className="hero-fact"><span className="fact-icon"><BriefcaseBusiness size={17} /></span><div><small>CURRENTLY</small><strong>State Street Corporation</strong><span>Software Engineer · Associate 2</span></div></div>
            <div className="hero-fact"><span className="fact-icon"><GraduationCap size={18} /></span><div><small>EDUCATION</small><strong>B.Tech · Computer Science</strong><span>Nirma University · 2021–2025</span></div></div>
            <div className="hero-fact"><span className="fact-icon"><Code2 size={18} /></span><div><small>INTERESTS</small><strong>Product & systems</strong><span>Frontend · Backend · Cloud</span></div></div>
          </motion.aside>
        </section>

        <section id="experience" className="page-width section-block">
          <Reveal><SectionTitle eyebrow="01 / EXPERIENCE" title="Where I’ve worked" description="Production engineering, application modernization, and practical problem-solving across two teams." /></Reveal>
          <div className="experience-grid">{experience.map((item, index) => <ExperienceCard item={item} index={index} key={item.company} />)}</div>
        </section>

        <section id="projects" className="page-width section-block">
          <Reveal><SectionTitle eyebrow="02 / PROJECTS" title="Things I’ve built" description="A selection of products and engineering experiments. Each project is presented with its own context and source." /></Reveal>
          <div className="projects-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.id} />)}</div>
        </section>

        <section id="skills" className="page-width section-block">
          <Reveal><SectionTitle eyebrow="03 / TECHNICAL SKILLS" title="Tools I work with" description="A practical toolkit across frontend, backend, data, cloud, and everyday engineering." /></Reveal>
          <div className="skills-grid">
            {skills.map((group, index) => {
              const Icon = [Code2, Monitor, Database, Cloud][index] ?? Layers3;
              return <Reveal delay={index * 0.05} key={group.group}><article className="skill-card"><div className="skill-card-head"><span className="skill-icon"><Icon size={19} /></span><small>0{index + 1}</small></div><h3>{group.group}</h3><div className="skill-list">{group.items.map((item) => <span key={item}>{item}</span>)}</div></article></Reveal>;
            })}
          </div>
        </section>

        <section id="playground" className="page-width section-block">
          <Reveal><SectionTitle eyebrow="04 / PLAYGROUND" title="A little command line" description="A small interactive terminal for exploring the information on this portfolio. It’s a navigation aid, not a real shell." /></Reveal>
          <Reveal delay={0.08}><TerminalPlayground /></Reveal>
        </section>

        <section id="about" className="page-width section-block about-section">
          <Reveal><div className="about-copy"><SectionTitle eyebrow="05 / ABOUT" title="A bit about me" /><p>{profile.about}</p><div className="interest-list">{profile.interests.map((interest) => <span key={interest}>{interest}</span>)}</div></div></Reveal>
          <Reveal delay={0.1}>
            <div className="credentials-panel">
              <div className="credentials-heading"><span className="credential-icon"><GraduationCap size={18} /></span><div><small>EDUCATION</small><strong>{education.degree}</strong></div></div>
              <div className="credential-detail"><span>{education.institution}</span><strong>{education.result}</strong></div>
              <div className="credential-location">{education.period} · {education.location}</div>
              <div className="credential-divider" />
              <div className="credentials-heading"><span className="credential-icon"><Award size={18} /></span><div><small>LEADERSHIP</small><strong>{leadership.role}</strong></div></div>
              <div className="credential-detail"><span>{leadership.organization}</span><small>{leadership.period}</small></div>
              <p className="leadership-detail">{leadership.detail}</p>
            </div>
          </Reveal>
        </section>

        <section className="page-width achievements-section">
          <Reveal><div className="achievements-heading"><div><div className="section-eyebrow"><span />A FEW MILESTONES</div><h2>Outside the day job</h2></div><p>Competitive programming and community work have been a consistent part of my learning journey.</p></div></Reveal>
          <div className="achievement-grid">
            {achievements.map((item, index) => <Reveal delay={index * 0.04} key={item.label}><div className="achievement-card"><div className="achievement-value">{item.value}</div><strong>{item.label}</strong><span>{item.detail}</span></div></Reveal>)}
          </div>
        </section>

        <section id="contact" className="page-width contact-section">
          <Reveal><div className="contact-panel"><div className="contact-copy"><div className="section-eyebrow"><span />06 / CONTACT</div><h2>Let’s build something useful.</h2><p>For engineering opportunities, interesting problems, or a thoughtful conversation, feel free to reach out.</p></div><div className="contact-actions"><a href={"mailto:" + profile.email} className="button button-primary"><Send size={15} /> Get in touch <ArrowUpRight size={14} /></a><CopyEmailButton /></div></div></Reveal>
          <Reveal><div className="contact-links"><a href={"mailto:" + profile.email}><Mail size={16} /> {profile.email} <ArrowUpRight size={13} /></a><a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a><a href="/resume"><FileText size={16} /> Résumé <ArrowUpRight size={13} /></a></div></Reveal>
        </section>

        <footer className="page-width site-footer">
          <a href="#home" className="footer-brand"><span className="brand-symbol">KI<span>.</span></span><strong>KRISH ITALIYA</strong></a>
          <span>DESIGNED & BUILT WITH CARE · {new Date().getFullYear()}</span>
          <a href="#home">BACK TO TOP ↑</a>
        </footer>
      </main>
    </MotionConfig>
  );
}
