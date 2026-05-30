"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function KeyVizPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/downloads")
      .then((r) => r.json())
      .then((d) => setDownloadCount(d.count))
      .catch(() => {});
  }, []);

  async function handleDownload() {
    try {
      const r = await fetch("/api/downloads", { method: "POST" });
      const d = await r.json();
      setDownloadCount(d.count);
    } catch {
      setDownloadCount((n) => (n ?? 0) + 1);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1f1f1f] shrink-0">
        <Link
          href="/projects"
          className="operator-text text-[10px] text-[#666] hover:text-white transition-colors"
        >
          ← PROJECTS
        </Link>
        <span className="operator-text text-[10px] text-[#444]">KEY·VIZ / SPECTRAL MIDI</span>
      </div>

      {/* Visualizer — grows to fill available space when panel is collapsed */}
      <iframe
        src="/key-viz.html"
        title="Key·Viz — Spectral MIDI"
        className="w-full border-0 transition-all duration-300"
        style={{ height: collapsed ? "calc(100vh - 45px)" : "70vh" }}
        allow="midi"
      />

      {/* Info + Download panel */}
      <div className="border-t border-[#1f1f1f] shrink-0">

        {/* Panel header / toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-between px-8 py-3 hover:bg-[#0a0a0a] transition-colors group"
        >
          <span className="operator-text text-[9px] text-[#444] group-hover:text-[#666] tracking-widest">
            {collapsed ? "SHOW GUIDE + DOWNLOAD" : "HIDE GUIDE + DOWNLOAD"}
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`text-[#444] group-hover:text-[#666] transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Collapsible body */}
        <div
          className={`overflow-hidden transition-all duration-300 ${collapsed ? "max-h-0" : "max-h-[600px]"}`}
        >
          <div className="px-8 py-8 flex flex-col md:flex-row gap-10 md:gap-16">

            {/* How to use */}
            <div className="flex-1">
              <p className="operator-text text-[9px] text-[#f59e0b] mb-3 tracking-widest">HOW TO USE</p>
              <h2 className="text-lg font-medium mb-4">Get started in two steps.</h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="operator-text text-[#f59e0b] text-sm shrink-0 mt-0.5">01</span>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Download &amp; open</p>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Download the standalone <code className="text-[#aaa] font-mono text-xs bg-[#111] px-1.5 py-0.5 rounded">.html</code> file below — it bundles everything.
                      Drag it into any desktop browser (Chrome, Firefox, Safari, Edge). No install, no server.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="operator-text text-[#f59e0b] text-sm shrink-0 mt-0.5">02</span>
                  <div>
                    <p className="text-white text-sm font-medium mb-1">Connect your MIDI device</p>
                    <p className="text-[#666] text-sm leading-relaxed">
                      Plug a MIDI keyboard or controller into your laptop or PC via USB. The app detects it
                      automatically — no drivers needed. Play and watch the spectral heatmap respond in real time.
                    </p>
                  </div>
                </li>
              </ol>
              <p className="text-[#444] text-xs mt-6 font-mono">
                iOS MIDI is not supported — Web MIDI API is locked on mobile Safari.
              </p>
            </div>

            {/* Download */}
            <div className="md:w-64 flex flex-col justify-between gap-6">
              <div>
                <p className="operator-text text-[9px] text-[#f59e0b] mb-3 tracking-widest">DOWNLOAD</p>
                <p className="text-white font-medium mb-1">Key·Viz Standalone</p>
                <p className="text-[#666] text-xs font-mono mb-1">key-viz.html · 1.4 MB</p>
                <p className="text-[#444] text-xs">Single-file bundle — works offline.</p>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="/key-viz.html"
                  download="Key-viz.html"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-between gap-3 border border-[#f59e0b]/60 text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors px-5 py-3 rounded operator-text text-xs tracking-widest"
                >
                  <span>DOWNLOAD .HTML</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                {downloadCount !== null && (
                  <p className="operator-text text-[9px] text-[#444] text-center tracking-widest">
                    {downloadCount} DOWNLOAD{downloadCount !== 1 ? "S" : ""}
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
