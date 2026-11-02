"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, X } from "lucide-react";
import type { Project } from "@/data/portfolio";

export function ProjectDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div className="project-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.article className="project-dialog" initial={{ opacity: 0, y: 28, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: 0.985 }} onMouseDown={(event) => event.stopPropagation()}>
            <header className="dialog-header">
              <div><div className="eyebrow">{project.number} / {project.category}</div><h2>{project.name}</h2><span className="dialog-status">{project.status}</span></div>
              <button className="icon-button" onClick={onClose} aria-label="Close project details"><X size={18} /></button>
            </header>
            <p className="dialog-description">{project.description}</p>
            <div className="dialog-grid">
              <div>
                <div className="eyebrow">IMPLEMENTATION NOTES</div>
                <ul className="proof-list">{project.proof.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
              </div>
              <div>
                <div className="eyebrow">SYSTEM MAP</div>
                <div className="architecture-list">{project.architecture.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div>
                <div className="tag-list dialog-tags">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
            </div>
            {project.note && <div className="project-caveat"><strong>Scope & safety boundary</strong>{project.note}</div>}
            <footer className="dialog-actions">{project.links.map((link) => <a key={link.url} className="button button-primary" href={link.url} target="_blank" rel="noreferrer">{link.label}<ArrowUpRight size={15} /></a>)}</footer>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
