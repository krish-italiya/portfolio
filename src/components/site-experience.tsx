"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";

type Phase = "idle" | "loading" | "intro" | "done";

function waitForCriticalAssets() {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>("img[data-critical='true']"));
  const imagePromises = images.map((image) => {
    if (image.complete) return image.decode().catch(() => undefined);
    return new Promise<void>((resolve) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });
  });

  return Promise.all([
    document.fonts?.ready?.catch(() => undefined),
    ...imagePromises
  ]).then(() => new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  }));
}

export function SiteExperienceGate() {
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    let cancelled = false;
    let ready = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const introKey = "krish-portfolio-intro-v1";
    const shouldPlayIntro = !reducedMotion && window.sessionStorage.getItem(introKey) !== "seen";

    const slowLoadTimer = window.setTimeout(() => {
      if (!cancelled && !ready) setPhase("loading");
    }, 180);

    void waitForCriticalAssets().then(() => {
      ready = true;
      window.clearTimeout(slowLoadTimer);
      if (cancelled) return;

      if (shouldPlayIntro) {
        window.sessionStorage.setItem(introKey, "seen");
        setPhase("intro");
      } else {
        setPhase("done");
      }
    });

    return () => {
      cancelled = true;
      window.clearTimeout(slowLoadTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;
    const timer = window.setTimeout(() => setPhase("done"), 1480);
    return () => window.clearTimeout(timer);
  }, [phase]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loader"
            className="experience-overlay loading-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.32, ease: "easeOut" } }}
          >
            <div className="experience-brand">
              <div className="experience-monogram">KI<span>.</span></div>
              <div className="experience-name">KRISH ITALIYA</div>
              <div className="experience-role">SOFTWARE ENGINEER</div>
            </div>
            <div className="experience-progress" role="progressbar" aria-label="Waiting for critical assets" />
            <p className="experience-caption">Preparing your experience</p>
          </motion.div>
        )}
        {phase === "intro" && (
          <motion.div
            key="intro"
            className="experience-overlay intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.015, transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] } }}
          >
            <button type="button" className="intro-skip" onClick={() => setPhase("done")}>SKIP INTRO <span>↗</span></button>
            <motion.div
              className="intro-content"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.13 } } }}
            >
              <motion.div
                className="intro-monogram"
                variants={{ hidden: { opacity: 0, y: 12, scale: 0.92 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >KI<span>.</span></motion.div>
              <motion.div
                className="intro-name"
                variants={{ hidden: { opacity: 0, y: 15, letterSpacing: "0.38em" }, visible: { opacity: 1, y: 0, letterSpacing: "0.2em" } }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              >KRISH ITALIYA</motion.div>
              <motion.div
                className="intro-line"
                variants={{ hidden: { scaleX: 0, opacity: 0 }, visible: { scaleX: 1, opacity: 1 } }}
                transition={{ duration: 0.58, ease: "easeOut" }}
              />
              <motion.div
                className="intro-role"
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.45 }}
              >SOFTWARE ENGINEER</motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

export function RouteLoading() {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <div className="route-loading-mark">KI<span>.</span></div>
      <div><strong>KRISH ITALIYA</strong><span>Loading page</span></div>
      <span className="route-loading-line" />
    </div>
  );
}
