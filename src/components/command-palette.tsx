"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Command, Search } from "lucide-react";

const commands = [
  { label: "Overview", detail: "Return to the top", href: "#top", key: "01" },
  { label: "Experience", detail: "Work and leadership", href: "#experience", key: "02" },
  { label: "Project lab", detail: "Selected engineering work", href: "#projects", key: "03" },
  { label: "Systems room", detail: "Explore Foundry architecture", href: "#systems", key: "04" },
  { label: "Technical toolkit", detail: "Languages and technologies", href: "#stack", key: "05" },
  { label: "Contact", detail: "Start a conversation", href: "#contact", key: "06" },
  { label: "GitHub", detail: "Open code profile", href: "https://github.com/krish-italiya", key: "GH", external: true },
  { label: "LinkedIn", detail: "Open professional profile", href: "https://www.linkedin.com/in/krishitaliya/", key: "in", external: true }
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => commands.filter((item) => (item.label + " " + item.detail).toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 30);
      setActive(0);
    } else {
      setQuery("");
    }
  }, [open]);

  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, filtered.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
    if (event.key === "Enter" && filtered[active]) {
      const item = filtered[active];
      if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
      else document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  };

  return (
    <>
      <button className="command-trigger" onClick={() => setOpen(true)} aria-label="Open command palette" data-cursor="COMMAND">
        <Command size={13} /><span>COMMAND</span><kbd>⌘ K</kbd>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="command-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}>
            <motion.div className="command-dialog" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} onMouseDown={(event) => event.stopPropagation()}>
              <div className="command-search"><Search size={17} /><input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onInputKey} placeholder="Search pages, projects, links..." aria-label="Search commands" /><kbd>ESC</kbd></div>
              <div className="command-list">
                <div className="command-caption">NAVIGATE / EXPLORE</div>
                {filtered.map((item, index) => (
                  <button key={item.key} className={"command-item " + (active === index ? "is-active" : "")} onMouseEnter={() => setActive(index)} onClick={() => { if (item.external) window.open(item.href, "_blank", "noopener,noreferrer"); else document.querySelector(item.href)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); }}>
                    <span className="command-key">{item.key}</span><span className="command-copy"><strong>{item.label}</strong><small>{item.detail}</small></span>{item.external ? <ArrowUpRight size={15} /> : <span className="command-arrow">↵</span>}
                  </button>
                ))}
                {filtered.length === 0 && <div className="command-empty">No matching destinations. Try another keyword.</div>}
              </div>
              <div className="command-footer"><span>KRISH.OS / COMMAND INTERFACE</span><span>↑ ↓ MOVE · ENTER OPEN · ESC CLOSE</span></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
