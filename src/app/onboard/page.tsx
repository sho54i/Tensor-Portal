"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./onboard.module.css";

type Stage = "hidden" | "materialize" | "centered" | "drawing" | "text" | "card";

const STORAGE_KEY = "aim-s4-onboard";

function OnboardInner() {
  const router = useRouter();
  const params = useSearchParams();
  const markRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("hidden");
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const [advOpen, setAdvOpen] = useState(false);
  const [nameError, setNameError] = useState(false);

  const [form, setForm] = useState({
    name: params.get("name") ?? "",
    role: params.get("role") ?? "editor",
    server: params.get("server") ?? "ws://localhost:8765",
    ollama: "http://localhost:8765/ollama",
    comfy: "",
    trainer: "",
  });

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const left = Math.max(100, Math.min(vw - 380, 80 + Math.random() * (vw - 400)));
    const top = Math.max(80, Math.min(vh - 340, 60 + Math.random() * (vh - 360)));
    setPos({ left, top });

    const timers = [
      setTimeout(() => setStage("materialize"), 220),
      setTimeout(() => setStage("centered"), 800),
      setTimeout(() => setStage("drawing"), 1500),
      setTimeout(() => setStage("text"), 2800),
      setTimeout(() => {
        setStage("card");
        playReadyChime();
      }, 4000),
      setTimeout(() => nameRef.current?.focus(), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function finish() {
    const name = form.name.trim();
    if (!name) {
      setNameError(true);
      nameRef.current?.focus();
      setTimeout(() => setNameError(false), 1500);
      return;
    }
    const config = {
      name,
      role: form.role,
      server: form.server.trim(),
      ollama: form.ollama.trim(),
      comfy: form.comfy.trim(),
      trainer: form.trainer.trim(),
      onboarded_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore quota / private mode
    }
    fetch("/api/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
      keepalive: true,
    }).catch(() => {});

    if (markRef.current) {
      markRef.current.style.transition = "opacity 0.35s, transform 0.35s";
      markRef.current.style.opacity = "0";
      markRef.current.style.transform = "translate(-50%, -50%) scale(0.96)";
    }
    setTimeout(() => router.push("/"), 380);
  }

  const markClasses = [
    styles.mark,
    stage !== "hidden" && styles.stageMaterialize,
    (stage === "centered" || stage === "drawing" || stage === "text" || stage === "card") && styles.stageCentered,
    (stage === "drawing" || stage === "text" || stage === "card") && styles.stageDrawing,
    (stage === "text" || stage === "card") && styles.stageText,
    stage === "card" && styles.stageCard,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.stage}>
      <div
        ref={markRef}
        className={markClasses}
        style={pos ? { left: pos.left, top: pos.top } : undefined}
      >
        <div className={styles.markTop}>
          <div className={styles.logoRing} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.logoImg} src="/assets/tensor-design.svg" alt="Tensor logo" />
          <div className={styles.scanBeam} />
          <div className={styles.cardHeaderWrap}>
            <div className={styles.cardHeaderLabel}>Tensor</div>
            <div className={styles.cardHeaderSub}>AIM S4 · Onboarding</div>
          </div>
          <div className={styles.subtitle}>AiM S4 · Onboarding</div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Display name</label>
            <input
              ref={nameRef}
              className={`${styles.fieldInput} ${nameError ? styles.errorBorder : ""}`}
              type="text"
              placeholder="Your name"
              autoComplete="off"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Role</label>
            <select
              className={styles.fieldInput}
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="owner">Owner</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Session server</label>
            <input
              className={styles.fieldInput}
              type="text"
              placeholder="ws://host:8765"
              value={form.server}
              onChange={(e) => update("server", e.target.value)}
            />
          </div>
          <div className={styles.advancedToggle} onClick={() => setAdvOpen((v) => !v)}>
            <svg
              className={`${styles.advancedChevron} ${advOpen ? styles.advancedChevronOpen : ""}`}
              viewBox="0 0 8 8"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 1 L6 4 L2 7 Z" />
            </svg>
            <span>Advanced — your local endpoints</span>
          </div>
          <div className={`${styles.advancedFields} ${advOpen ? styles.advancedFieldsOpen : ""}`}>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Your Ollama URL</label>
              <input
                className={styles.fieldInput}
                type="text"
                value={form.ollama}
                onChange={(e) => update("ollama", e.target.value)}
              />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Your ComfyUI URL (optional)</label>
              <input
                className={styles.fieldInput}
                type="text"
                placeholder="http://localhost:8000"
                value={form.comfy}
                onChange={(e) => update("comfy", e.target.value)}
              />
            </div>
            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>Your Trainer URL (optional)</label>
              <input
                className={styles.fieldInput}
                type="text"
                placeholder="http://localhost:8767"
                value={form.trainer}
                onChange={(e) => update("trainer", e.target.value)}
              />
            </div>
          </div>
          <button className={styles.continueBtn} onClick={finish}>
            Enter Tensor
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className={styles.stage} />}>
      <OnboardInner />
    </Suspense>
  );
}

let audioCtx: AudioContext | null = null;
function playReadyChime() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    audioCtx ??= new AC();
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    const now = audioCtx.currentTime;
    [440, 660, 880].forEach((f, i) => {
      const osc = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, now + i * 0.08);
      gain.gain.setValueAtTime(0.0001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.2);
      osc.connect(gain).connect(audioCtx!.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  } catch {
    // audio not available
  }
}
