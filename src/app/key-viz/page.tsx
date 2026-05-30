import Link from "next/link";

export const metadata = {
  title: "Key·Viz — Spectral MIDI",
  description: "Real-time piano heatmaps with harmonic analysis.",
};

export default function KeyVizPage() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1f1f1f] shrink-0">
        <Link
          href="/projects"
          className="operator-text text-[10px] text-[#666] hover:text-white transition-colors"
        >
          ← PROJECTS
        </Link>
        <span className="operator-text text-[10px] text-[#444]">KEY·VIZ / SPECTRAL MIDI</span>
      </div>
      <iframe
        src="/key-viz.html"
        title="Key·Viz — Spectral MIDI"
        className="flex-1 w-full border-0"
        allow="midi"
      />
    </div>
  );
}
