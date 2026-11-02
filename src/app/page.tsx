"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  Menu,
  Monitor,
  Send,
  Sparkles,
  X
} from "lucide-react";
import {
  achievements,
  education,
  experience,
  leadership,
  profile,
  projects,
  skills
} from "@/data/portfolio";
import { ThemeControl } from "@/components/providers";

const navItems = [
  ["Home", "#home"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
  ["About", "#about"],
  ["Contact", "#contact"]
];

const projectFilters = ["All work", "Product", "Full-stack", "Platform", "Data"] as const;
type ProjectFilter = (typeof projectFilters)[number];

function projectFilter(id: string): ProjectFilter {
  if (id === "instacv") return "Product";
  if (id === "airbnb") return "Full-stack";
  if (id === "foundry") return "Platform";
  if (id === "ipl") return "Data";
  return "All work";
}

function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.12
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function PageProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001
  });
  return <motion.div className="page-progress" style={{ scaleX }} aria-hidden="true" />;
}

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  accent = "lime"
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  accent?: string;
}) {
  return (
    <div className={"section-heading accent-" + accent}>
      <div className="section-heading-top">
        <span className="section-index">{index}</span>
        <span className="section-eyebrow">{eyebrow}</span>
      </div>
      <div className="section-heading-main">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const elements = navItems
      .map(([, href]) => document.querySelector<HTMLElement>(href))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-24% 0px -62% 0px", threshold: [0, 0.15, 0.35, 0.6] }
    );
    elements.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <div className="page-width nav-inner">
        <a href="#home" className="brand" aria-label="Krish Italiya home">
          <span className="brand-symbol">K<span>.</span></span>
          <span className="brand-copy">
            <strong>Krish Italiya</strong>
            <small>SOFTWARE ENGINEER</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a href={href} key={href} className={active === href.slice(1) ? "active" : ""}>
              {label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <a className="nav-social" href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github size={17} />
          </a>
          <a className="nav-social" href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin size={17} />
          </a>
          <ThemeControl />
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24 }}
          >
            {navItems.map(([label, href]) => (
              <a href={href} key={href} onClick={() => setMobileOpen(false)}>{label}</a>
            ))}
            <a href="/resume" onClick={() => setMobileOpen(false)}>View résumé <ArrowUpRight size={14} /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroPortrait() {
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"]
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [22, -22]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [-8, 12]);

  return (
    <motion.div className="hero-visual" ref={frameRef}>
      <div className="hero-visual-glow" />
      <motion.div className="portrait-orbit orbit-a" style={{ rotate: orbitRotate }} />
      <motion.div className="portrait-orbit orbit-b" style={{ rotate: orbitRotate }} />
      <div className="portrait-grid" />
      <motion.div className="portrait-cutout-wrap" style={{ y: portraitY }}>
        <Image
          src="/krish-portrait.webp"
          alt="Krish Italiya wearing a dark charcoal jacket"
          width={480}
          height={755}
          priority
          data-critical="true"
          className="portrait-image"
          sizes="(max-width: 760px) 86vw, (max-width: 1100px) 46vw, 520px"
        />
      </motion.div>
      <motion.div
        className="floating-note note-one"
        initial={{ opacity: 0, x: 20, y: 12 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.85, duration: 0.65 }}
      >
        <span className="note-icon note-lime"><Code2 size={15} /></span>
        <span><small>BUILDING WITH</small><strong>React · TypeScript</strong></span>
      </motion.div>
      <motion.div
        className="floating-note note-two"
        initial={{ opacity: 0, x: -20, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.05, duration: 0.65 }}
      >
        <span className="note-icon note-cyan"><Cloud size={15} /></span>
        <span><small>WORKING ACROSS</small><strong>Product · Systems · Cloud</strong></span>
      </motion.div>
      <div className="portrait-caption">
        <span className="caption-rule" />
        <span>KRISH ITALIYA</span>
        <small>HYDERABAD, INDIA</small>
      </div>
      <span className="portrait-coordinate coordinate-top">17° 26&apos; N / 78° 22&apos; E</span>
      <span className="portrait-coordinate coordinate-bottom">SOFTWARE ENGINEER / 2026</span>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="hero-section page-width" id="home">
      <div className="hero-copy">
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span className="availability-dot" />
          SOFTWARE ENGINEER
          <span className="kicker-divider">/</span>
          FULL-STACK
          <span className="kicker-divider">/</span>
          CLOUD
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.82, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          I build <span className="hero-serif">useful</span>
          <br />
          things for the
          <br />
          <span className="hero-gradient-text">real world.</span>
        </motion.h1>
        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          I&apos;m Krish, a software engineer at State Street. I work across
          interfaces, APIs and the systems behind them—turning complex
          requirements into dependable, thoughtful software.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.31 }}
        >
          <a href="#projects" className="button button-primary">
            Explore my work <ArrowUpRight size={16} />
          </a>
          <a href="/resume" className="button button-quiet">
            <FileText size={15} /> Résumé
          </a>
        </motion.div>
        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.48, duration: 0.55 }}
        >
          <span><BriefcaseBusiness size={14} /> {profile.currentRole}</span>
          <i />
          <span><Cloud size={14} /> {profile.location}</span>
        </motion.div>
        <motion.a
          href="#experience"
          className="hero-scroll-cue"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <span className="scroll-cue-line" />
          SCROLL TO EXPLORE
          <ArrowDownRight size={13} />
        </motion.a>
      </div>
      <HeroPortrait />
      <div className="hero-side-label" aria-hidden="true">
        <span>01</span><i /><span>06</span>
      </div>
    </section>
  );
}

function TechMarquee() {
  const items = [
    "React", "TypeScript", "Java", "Spring Boot", "Oracle", "Node.js",
    "Python", "Google Cloud", "Docker", "Vite", "Redux Toolkit", "MongoDB"
  ];
  return (
    <div className="marquee-band" aria-label="Technologies">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-list" key={copy} aria-hidden={copy === 1}>
            {items.map((item, index) => (
              <span className="marquee-item" key={item}>
                {item}<i className={"marquee-dot dot-" + (index % 4)} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceSection() {
  const [expanded, setExpanded] = useState<string | null>("State Street Corporation");
  return (
    <section id="experience" className="section-block experience-section page-width">
      <Reveal>
        <SectionHeading
          index="01"
          eyebrow="THE JOURNEY SO FAR"
          title={<>Where I&apos;ve <span className="heading-italic">worked.</span></>}
          description="A little context on the teams, products and production problems I’ve worked with."
          accent="cyan"
        />
      </Reveal>
      <div className="experience-list">
        {experience.map((item, index) => {
          const isOpen = expanded === item.company;
          return (
            <Reveal delay={index * 0.09} key={item.company}>
              <article className={"experience-item " + (isOpen ? "is-expanded" : "")}>
                <button
                  type="button"
                  className="experience-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : item.company)}
                >
                  <span className="experience-number">0{index + 1}</span>
                  <span className="experience-main">
                    <small>{item.period} · {item.location}</small>
                    <strong>{item.company}</strong>
                    <span>{item.roles.map((role) => role.title).join(" / ")}</span>
                  </span>
                  <span className="experience-more">{isOpen ? "CLOSE" : "DETAILS"} <ChevronDown size={15} /></span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="experience-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="experience-summary">{item.summary}</div>
                      <ul>
                        {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                      </ul>
                      <div className="project-tags">
                        {item.stack.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ProjectArtwork({ id }: { id: string }) {
  if (id === "foundry") {
    return (
      <div className="project-art foundry-art" aria-hidden="true">
        <div className="product-window">
          <div className="window-bar"><span /><span /><span /><small>foundry / overview</small><i>● DEPLOYMENT READY</i></div>
          <div className="foundry-screen">
            <aside><b>F.</b><i /><i /><i /><i /></aside>
            <div className="foundry-board">
              <div className="preview-welcome"><small>WORKSPACE / OVERVIEW</small><strong>Good morning, developer.</strong><span>One place to manage your deployments.</span></div>
              <div className="preview-status-row"><i /><i /><i /></div>
              <div className="preview-build-row"><span>web-client</span><b>BUILD PASSED</b><i /></div>
              <div className="preview-build-row"><span>api-service</span><b>RUNNING</b><i /></div>
            </div>
          </div>
        </div>
        <span className="art-orbit" />
      </div>
    );
  }
  if (id === "instacv") {
    return (
      <div className="project-art instacv-art" aria-hidden="true">
        <div className="product-window">
          <div className="window-bar"><span /><span /><span /><small>instacv / editor</small><i>LIVE PREVIEW</i></div>
          <div className="instacv-screen">
            <aside><b>EDIT</b><i /><i /><i /><i /><i /></aside>
            <div className="resume-preview">
              <b>YOUR NAME</b><small>SOFTWARE ENGINEER</small>
              <i /><i /><i /><strong>EXPERIENCE</strong><i /><i /><i /><strong>EDUCATION</strong><i /><i />
            </div>
          </div>
        </div>
        <span className="art-orbit" />
      </div>
    );
  }
  if (id === "airbnb") {
    return (
      <div className="project-art airbnb-art" aria-hidden="true">
        <div className="product-window">
          <div className="window-bar"><span /><span /><span /><small>stays / discover</small><i>EXPLORE</i></div>
          <div className="airbnb-screen">
            <strong>Find a place to <em>stay.</em></strong>
            <div className="stay-search"><span>Where <b>Anywhere</b></span><span>When <b>Any week</b></span><span>Who <b>Add guests</b></span><i>⌕</i></div>
            <div className="stay-tiles"><i /><i /><i /></div>
          </div>
        </div>
        <span className="art-orbit" />
      </div>
    );
  }
  return (
    <div className="project-art ipl-art" aria-hidden="true">
      <div className="product-window">
        <div className="window-bar"><span /><span /><span /><small>ipl / insights</small><i>SEASON ANALYSIS</i></div>
        <div className="ipl-screen">
          <div className="ipl-preview-head"><strong>Season overview</strong><small>ALL SEASONS</small></div>
          <div className="ipl-preview-metrics"><i /><i /><i /></div>
          <div className="ipl-preview-chart">
            {[38, 66, 48, 82, 57, 92, 68, 45, 76, 58, 88, 63].map((height, index) => (
              <i key={index} style={{ height: height + "%" }} />
            ))}
          </div>
        </div>
      </div>
      <span className="art-orbit" />
    </div>
  );
}

function ProjectCard({
  project,
  index
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  return (
    <Reveal delay={(index % 2) * 0.08}>
      <motion.article
        className={"project-card project-" + project.id}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <a href={project.source} target="_blank" rel="noreferrer" className="project-art-link" aria-label={"Open " + project.name + " source code"}>
          <ProjectArtwork id={project.id} />
          <span className="project-open"><ArrowUpRight size={17} /></span>
        </a>
        <div className="project-content">
          <div className="project-meta"><span>{project.number} / SELECTED WORK</span><span>{project.category}</span></div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <div className="project-actions">
            <a href={project.source} target="_blank" rel="noreferrer"><Github size={14} /> Source <ArrowUpRight size={12} /></a>
            {project.live && <a href={project.live} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Live app <ArrowUpRight size={12} /></a>}
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

function ProjectsSection() {
  const [filter, setFilter] = useState<ProjectFilter>("All work");
  const filtered = projects.filter((project) => filter === "All work" || projectFilter(project.id) === filter);
  return (
    <section id="projects" className="section-block projects-section page-width">
      <Reveal>
        <SectionHeading
          index="02"
          eyebrow="SELECTED WORK"
          title={<>A few things I&apos;ve <span className="heading-italic">made.</span></>}
          description="A balanced collection of products, full-stack applications and engineering experiments."
          accent="coral"
        />
      </Reveal>
      <div className="project-filter-row" role="group" aria-label="Filter projects">
        {projectFilters.map((item) => (
          <button
            type="button"
            key={item}
            className={filter === item ? "is-active" : ""}
            aria-pressed={filter === item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
        <span>{filtered.length.toString().padStart(2, "0")} PROJECTS</span>
      </div>
      <motion.div layout className="projects-grid">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={project} index={projects.findIndex((item) => item.id === project.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function SkillsSection() {
  const [selected, setSelected] = useState(0);
  const [currentSkills, setCurrentSkills] = useState(skills[0]);
  const currentIndex = Math.min(selected, skills.length - 1);
  const group = skills[currentIndex];

  return (
    <section id="skills" className="section-block skills-section page-width">
      <Reveal>
        <SectionHeading
          index="03"
          eyebrow="THE TOOLKIT"
          title={<>Technologies I <span className="heading-italic">work with.</span></>}
          description="The tools I use to build, ship and maintain software across the stack."
          accent="violet"
        />
      </Reveal>
      <div className="toolkit-layout">
        <div className="toolkit-tabs" role="tablist" aria-label="Skill categories">
          {skills.map((item, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selected === index}
              className={selected === index ? "active" : ""}
              key={item.group}
              onClick={() => setSelected(index)}
            >
              <span>0{index + 1}</span>{item.group}<ArrowUpRight size={14} />
            </button>
          ))}
        </div>
        <div className="toolkit-content" role="tabpanel">
          <AnimatePresence mode="wait">
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24 }}
            >
              <span className="toolkit-kicker">CATEGORY / 0{currentIndex + 1}</span>
              <h3>{group.group.toLowerCase().replaceAll("&", "and")}</h3>
              <p>
                {currentIndex === 0 && "Languages I use for application development, scripting, data work and problem solving."}
                {currentIndex === 1 && "Building responsive interfaces, stateful user experiences and complex data-heavy screens."}
                {currentIndex === 2 && "Designing APIs, connecting services and working with relational and document databases."}
                {currentIndex === 3 && "The infrastructure and delivery tools I use to develop, test and ship software."}
              </p>
              <div className="toolkit-pills">
                {group.items.map((item, index) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.045 }}
                  >{item}</motion.span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function AchievementsSection() {
  return (
    <section className="achievements-section page-width">
      <Reveal>
        <SectionHeading
          index="04"
          eyebrow="OUTSIDE THE DAY JOB"
          title={<>A little competitive <span className="heading-italic">edge.</span></>}
          description="Problem solving has shaped how I approach engineering: break things down, test assumptions and keep going."
          accent="lime"
        />
      </Reveal>
      <div className="achievement-grid">
        {achievements.map((item, index) => (
          <Reveal delay={index * 0.06} key={item.label}>
            <div className={"achievement-card achievement-" + index}>
              <span className="achievement-index">0{index + 1}</span>
              <strong>{item.value}</strong>
              <span className="achievement-label">{item.label}</span>
              <small>{item.detail}</small>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section-block about-section page-width">
      <Reveal className="about-copy">
        <SectionHeading
          index="05"
          eyebrow="A LITTLE ABOUT ME"
          title={<>Curious by default. <span className="heading-italic">Engineer by choice.</span></>}
          description="The person behind the commits."
          accent="cyan"
        />
        <p>{profile.about}</p>
        <div className="about-interests">
          {profile.interests.map((interest) => <span key={interest}><Sparkles size={12} /> {interest}</span>)}
        </div>
      </Reveal>
      <Reveal className="about-details" delay={0.1}>
        <div className="about-detail-block">
          <span className="detail-icon detail-violet"><GraduationCap size={18} /></span>
          <div>
            <small>EDUCATION</small>
            <strong>{education.degree}</strong>
            <span>{education.institution}</span>
            <em>{education.period} · CGPA {education.result}</em>
          </div>
        </div>
        <div className="about-detail-divider" />
        <div className="about-detail-block">
          <span className="detail-icon detail-coral"><Award size={18} /></span>
          <div>
            <small>LEADERSHIP</small>
            <strong>{leadership.role}</strong>
            <span>{leadership.organization}</span>
            <em>{leadership.period}</em>
            <p>{leadership.detail}</p>
          </div>
        </div>
      </Reveal>
    </section>
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
  return (
    <button type="button" className="button button-secondary" onClick={copy}>
      {copied ? <Check size={15} /> : <Mail size={15} />}
      {copied ? "Email copied" : "Copy email"}
    </button>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="contact-section page-width">
      <Reveal>
        <div className="contact-panel">
          <div className="contact-orb" />
          <div className="contact-copy">
            <div className="contact-eyebrow"><span />06 / SAY HELLO</div>
            <h2>Have something<br /><em>interesting</em> in mind?</h2>
            <p>I’m always open to thoughtful conversations, engineering opportunities and ideas worth building.</p>
          </div>
          <div className="contact-actions">
            <a href={"mailto:" + profile.email} className="button button-primary">
              <Send size={15} /> Get in touch <ArrowUpRight size={15} />
            </a>
            <CopyEmailButton />
          </div>
        </div>
      </Reveal>
      <div className="contact-links">
        <a href={profile.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={13} /></a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} /></a>
        <a href="/resume"><FileText size={16} /> Résumé <ArrowUpRight size={13} /></a>
        <a href={"mailto:" + profile.email}><Mail size={16} /> {profile.email} <ArrowUpRight size={13} /></a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <PageProgress />
      <main className="site-shell">
        <Header />
        <Hero />
        <TechMarquee />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <AchievementsSection />
        <AboutSection />
        <ContactSection />
        <footer className="page-width site-footer">
          <a href="#home" className="footer-brand">
            <span className="brand-symbol">K<span>.</span></span>
            <strong>KRISH ITALIYA</strong>
          </a>
          <span>DESIGNED & BUILT WITH CARE · {new Date().getFullYear()}</span>
          <a href="#home">BACK TO TOP ↑</a>
        </footer>
      </main>
    </MotionConfig>
  );
}
