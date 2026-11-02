"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Braces, Check, Command, Cpu,
  ExternalLink, FileText, Github, Globe2, Layers3, Linkedin, Menu, Moon,
  Send, Terminal, Zap
} from "lucide-react";
import {
  achievements, education, experience, leadership, profile, projects, signals, skills
} from "@/data/portfolio";
import { ThemeControl } from "@/components/providers";
import { ParticlePortrait } from "@/components/visual-effects";
import { CommandPalette } from "@/components/command-palette";
import { ProjectDialog } from "@/components/project-dialog";

const navItems = [
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Systems", "#systems"],
  ["Stack", "#stack"],
  ["Contact", "#contact"]
];

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={"reveal " + (visible ? "is-visible " : "") + (delay ? "delay-" + delay + " " : "") + className}>{children}</div>;
}

function SectionHeading({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="section-head">
      <div><div className="eyebrow">{index} / KRISH.OS</div><h2 className="section-title">{title}</h2></div>
      <p className="section-description">{description}</p>
    </div>
  );
}

function TerminalWidget() {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<string[]>([
    "krish-os shell / build 1.0.0",
    "This is a portfolio terminal. Type 'help' to begin."
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const commands: Record<string, string> = {
    help: "Available: about · skills · projects · experience · contact · clear",
    about: "Krish Italiya — software engineer building interfaces, systems, and developer tools.",
    skills: "React · TypeScript · Java · Spring Boot · Oracle · Docker · Google Cloud",
    projects: "Featured builds: Foundry, InstaCV, Airbnb Clone, IPL Data Analysis. Scroll to #projects.",
    experience: "Currently: Software Engineer · Associate 2 at State Street Corporation.",
    contact: "Email: krishitaliya11@gmail.com"
  };
  const run = (raw: string) => {
    const command = raw.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") { setLines([]); setInput(""); return; }
    setLines((current) => [...current, "> " + raw, commands[command] || "Command not found. Type 'help' for available commands."]);
    setInput("");
  };
  return (
    <div className="terminal">
      <div className="terminal-header"><div className="terminal-title"><Terminal size={13} className="accent-text" /> krish@portfolio:~</div><div className="terminal-lights"><i/><i/><i/></div></div>
      <div className="terminal-body">
        <div className="terminal-lines" aria-live="polite">
          {lines.map((line, index) => <div key={index} className={line.startsWith(">") ? "command-line" : ""}>{line}</div>)}
        </div>
        <form className="terminal-prompt" onSubmit={(event) => { event.preventDefault(); run(input); }}>
          <span>➜</span><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder="type a command..." aria-label="Portfolio terminal command" /><button type="submit" aria-label="Run command"><ArrowRight size={14}/></button>
        </form>
      </div>
    </div>
  );
}

function GithubCard() {
  const [stats, setStats] = useState<{ publicRepos: number; followers: number } | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch("/api/github").then((response) => {
      if (!response.ok) throw new Error("Profile stats unavailable");
      return response.json();
    }).then((data) => {
      if (alive) setStats({ publicRepos: data.publicRepos, followers: data.followers });
    }).catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, []);
  return (
    <div className="github-card">
      <div className="github-head">
        <div className="github-avatar"><Github size={20}/><div><strong>krish-italiya</strong><small>PUBLIC GITHUB PROFILE</small></div></div>
        <a href={profile.github} target="_blank" rel="noreferrer" className="icon-button" aria-label="Open GitHub profile"><ArrowUpRight size={16}/></a>
      </div>
      <div className="github-metrics">
        <div className="github-metric"><strong>{stats ? stats.publicRepos : "—"}</strong><span>Public repositories</span></div>
        <div className="github-metric"><strong>{stats ? stats.followers : "—"}</strong><span>Followers</span></div>
      </div>
      <div className="github-note">{failed ? "GitHub profile stats are temporarily unavailable. The profile link remains live." : "Profile figures fetched from GitHub and cached for one hour."}</div>
    </div>
  );
}

function ProjectCard({ project, onOpen, index }: { project: typeof projects[number]; onOpen: () => void; index: number }) {
  return (
    <Reveal delay={index % 2 ? 1 : 0} className={project.featured ? "project-card-wrap featured" : "project-card-wrap"}>
      <button className={"project-card panel-hover " + (project.featured ? "featured" : "")} onClick={onOpen} data-cursor="EXPLORE">
        <div className="project-topline"><span className="project-index">{project.number} / {project.category}</span><span className="project-status">{project.status}</span></div>
        <div className="project-main">
          <div><h3 className="project-title">{project.name}<ArrowUpRight size={18}/></h3><p className="project-summary">{project.summary}</p><div className="tag-list">{project.stack.slice(0, 5).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          {project.featured && <div className="project-art" aria-hidden="true"><div className="project-art-icon"><Layers3 size={23}/></div><div className="project-art-lines"><span/><span/><span/></div></div>}
        </div>
        <div className="project-footer"><span>OPEN ENGINEERING CASE STUDY</span><ArrowDownRight size={15}/></div>
      </button>
    </Reveal>
  );
}

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const selected = useMemo(() => projects.find((project) => project.id === selectedProject) || null, [selectedProject]);

  useEffect(() => {
    const ids = ["top", "experience", "projects", "systems", "stack", "contact"];
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, .15, .35, .6] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      window.location.href = "mailto:" + profile.email;
    }
  };

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="container nav-inner">
          <a href="#top" className="brand" aria-label="Krish Italiya home">
            <div className="brand-mark">KI<span>.</span></div>
            <div><div className="brand-name">KRISH ITALIYA</div><div className="brand-sub">ENGINEERING PORTFOLIO / 001</div></div>
          </a>
          <nav className="nav-links" aria-label="Main navigation">
            {navItems.map(([label, href]) => <a key={href} href={href} className={activeSection === href.slice(1) ? "active" : ""}>{label}</a>)}
          </nav>
          <div className="nav-actions">
            <ThemeControl />
            <CommandButton />
            <button className="icon-button mobile-toggle" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={mobileOpen}><Menu size={17}/></button>
          </div>
        </div>
        {mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</a>)}</nav>}
      </header>

      <section id="top" className="container hero">
        <div className="hero-copy">
          <motion.div className="hero-status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
            <span className="status-dot"/><span>OPEN TO ENGINEERING CONVERSATIONS</span><span>/</span><span>{profile.location}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .08 }}>
            <div className="eyebrow hero-kicker">SOFTWARE ENGINEER / FULL-STACK & SYSTEMS</div>
            <h1 className="hero-title">Building<br/><span className="soft-line">what&apos;s</span><br/><span className="accent-text">next.</span></h1>
            <p className="hero-description"><strong>{profile.tagline}</strong> {profile.intro}</p>
          </motion.div>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25 }}>
            <a href="#projects" className="button button-primary">EXPLORE MY WORK <ArrowDownRight size={15}/></a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="button button-quiet"><Github size={14}/> GITHUB <ArrowUpRight size={13}/></a>
            <button onClick={copyEmail} className="button button-quiet">{emailCopied ? <Check size={14}/> : <FileText size={14}/>} {emailCopied ? "COPIED" : "COPY EMAIL"}</button>
          </motion.div>
          <motion.div className="hero-focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .45 }}>
            <span className="hero-focus-label">CURRENT FOCUS</span><span className="focus-separator"/><span className="focus-items">{profile.currentFocus.join(" · ")}</span>
          </motion.div>
        </div>
        <motion.div className="hero-visual" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .16 }}>
          <div className="visual-glow"/>
          <ParticlePortrait />
          <div className="hero-caption"><span>BUILD MODE / ACTIVE</span><strong>RESEARCH → ENGINEER → REFINE</strong></div>
        </motion.div>
      </section>

      <div className="container">
        <Reveal>
          <div className="signal-strip">
            {signals.map((signal, index) => <div className="signal" key={signal.label}><span className="signal-index">0{index + 1}</span><div><div className="signal-value">{signal.value}</div><div className="signal-label">{signal.label}</div><div className="signal-detail">{signal.detail}</div></div></div>)}
          </div>
        </Reveal>
      </div>

      <section id="experience" className="container section">
        <Reveal><SectionHeading index="01 / THE JOURNEY" title="Where I've built." description="Production engineering, pragmatic problem-solving, and a bias for making complex interfaces feel simple."/></Reveal>
        <div className="experience-grid">
          <div className="timeline">
            {experience.map((item, index) => <Reveal key={item.company + item.period} delay={index % 2 ? 1 : 0}>
              <article className="timeline-item">
                <span className="timeline-dot"/>
                <div className="timeline-period">{item.period}</div>
                <h3 className="timeline-role">{item.role}</h3>
                <div className="timeline-company">{item.company} <span className="timeline-location">/ {item.location}</span></div>
                <p className="timeline-description">{item.description}</p>
                <ul className="highlight-list">{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                <div className="tag-list">{item.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            </Reveal>)}
          </div>
          <div className="side-stack">
            <Reveal><article className="info-card">
              <div className="eyebrow">EDUCATION / {education.period}</div>
              <div className="info-card-head"><div><h3>{education.degree}</h3><p>{education.institution}<br/>{education.location}</p></div><div className="info-badge">{education.result}</div></div>
              <div className="timeline-location" style={{ marginTop: 14 }}>CGPA / 10</div>
            </article></Reveal>
            <Reveal delay={1}><article className="info-card">
              <div className="eyebrow">LEADERSHIP / {leadership.period}</div>
              <h3>{leadership.role}</h3><p>{leadership.organization}</p><p>{leadership.detail}</p>
              <div className="tag-list"><span>COMMUNITY</span><span>EVENT OPERATIONS</span><span>PROBLEM DESIGN</span></div>
            </article></Reveal>
            <Reveal delay={2}><article className="info-card">
              <div className="eyebrow">COMPETITIVE PROGRAMMING</div>
              {achievements.map((achievement) => <div className="achievement-row" key={achievement.label}><div><div className="achievement-label">{achievement.label}</div><div className="achievement-detail">{achievement.detail}</div></div><div className="achievement-value">{achievement.value}</div></div>)}
              <p style={{ fontSize: 9 }}>Rating and ranking figures are from the supplied resume; profile verification is still pending.</p>
            </article></Reveal>
          </div>
        </div>
      </section>

      <section id="projects" className="container section">
        <Reveal><SectionHeading index="02 / SELECTED BUILDS" title="Things I've shipped." description="Project deep-dives that show the problem, implementation, architecture, and engineering trade-offs — not just a screenshot and a stack list."/></Reveal>
        <div className="project-grid">
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} onOpen={() => setSelectedProject(project.id)}/>)}
        </div>
      </section>

      <section id="systems" className="container section">
        <Reveal><SectionHeading index="03 / SYSTEMS ROOM" title="Think in systems." description="A closer look at the platform engineering questions I'm exploring through Foundry."/></Reveal>
        <div className="systems-layout">
          <Reveal className="systems-copy">
            <div className="eyebrow">FOUNDRY / INTERNAL DEVELOPER PLATFORM</div>
            <h3>From source<br/>to running service.</h3>
            <p>Foundry explores the control plane behind a developer platform: register a trusted repository, request a deployment, follow the build, inspect logs, and check application health. The current demo uses a local runtime and is deliberately not presented as a public production PaaS.</p>
            <div className="tag-list"><span>JAVA</span><span>SPRING BOOT</span><span>REACT</span><span>DOCKER</span><span>RUNTIME ADAPTERS</span></div>
            <div style={{ marginTop: 24 }}><a href="https://github.com/krish-italiya/Foundry" target="_blank" rel="noreferrer" className="button button-primary">EXPLORE FOUNDRY <ArrowUpRight size={14}/></a></div>
          </Reveal>
          <Reveal delay={1}>
            <div className="systems-flow">
              <div className="flow-caption"><span>DEPLOYMENT PATH / CONCEPTUAL VIEW</span><span>FLOW.001</span></div>
              <div className="flow-nodes">
                <div className="flow-node"><span>01</span><strong>Source repository</strong></div><div className="flow-connector"/>
                <div className="flow-node primary"><span>02</span><strong>Control plane API</strong><i className="flow-pulse"/></div><div className="flow-connector"/>
                <div className="flow-node"><span>03</span><strong>Build worker</strong></div><div className="flow-connector"/>
                <div className="flow-node"><span>04</span><strong>Runtime adapter</strong></div><div className="flow-connector"/>
                <div className="flow-node"><span>05</span><strong>Application + health check</strong></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="stack" className="container section">
        <Reveal><SectionHeading index="04 / THE TOOLKIT" title="Tools of the trade." description="The technologies I use to turn a requirement into something reliable, usable, and maintainable."/></Reveal>
        <div className="skills-grid">{skills.map((group, index) => <Reveal key={group.group} delay={index % 3}><div className="skill-card"><div className="skill-card-head"><span className="eyebrow">{group.group}</span><span className="mono muted" style={{ fontSize: 8 }}>0{index + 1}</span></div><div className="skill-items">{group.items.map((item) => <span key={item}>{item}</span>)}</div></div></Reveal>)}</div>
      </section>

      <section className="container section">
        <div className="interactive-row">
          <Reveal className="interactive-copy"><div className="eyebrow">05 / INTERACTIVE TERMINAL</div><h2>Don't just browse.<br/><span className="accent-text">Explore.</span></h2><p>A tiny shell for the curious. Ask it about me, inspect the stack, or jump to a project. You can also use the command palette with Ctrl/⌘ + K.</p><div style={{ marginTop: 23 }}><GithubCard/></div></Reveal>
          <Reveal delay={1}><TerminalWidget/></Reveal>
        </div>
      </section>

      <section id="contact" className="contact-wrap">
        <div className="container contact-inner">
          <Reveal>
            <div className="eyebrow">06 / OPEN CHANNEL</div>
            <h2 className="contact-title">Have a hard<br/>problem? <span className="accent-text">Let's build.</span></h2>
            <p className="contact-description">I'm interested in thoughtful engineering conversations, challenging products, and teams that care about how things are built.</p>
            <div style={{ marginTop: 27 }}><a href={"mailto:" + profile.email} className="button button-primary">START A CONVERSATION <Send size={14}/></a></div>
          </Reveal>
          <Reveal delay={1} className="contact-links">
            <a href={"mailto:" + profile.email} className="contact-link"><span><Globe2 size={15}/>{profile.email}</span><ArrowUpRight size={14}/></a>
            <a href={profile.github} target="_blank" rel="noreferrer" className="contact-link"><span><Github size={15}/>GitHub</span><ArrowUpRight size={14}/></a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-link"><span><Linkedin size={15}/>LinkedIn</span><ArrowUpRight size={14}/></a>
            <a href="/Krish_Italiya_Resume.pdf" target="_blank" rel="noreferrer" className="contact-link"><span><FileText size={15}/>Resume PDF</span><ArrowUpRight size={14}/></a>
          </Reveal>
        </div>
      </section>

      <footer className="container footer"><div>© {new Date().getFullYear()} KRISH ITALIYA / BUILT WITH INTENT.</div><div className="footer-right"><span>DESIGNED & ENGINEERED</span><span className="accent-text">●</span><a href="#top">BACK TO TOP ↑</a></div></footer>

      <CommandPalette />
      <ProjectDialog project={selected} onClose={() => setSelectedProject(null)} />
    </main>
  );
}

function CommandButton() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return <button className="command-trigger" onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}><Command size={13}/><span>COMMAND</span><kbd>⌘ K</kbd></button>;
}
