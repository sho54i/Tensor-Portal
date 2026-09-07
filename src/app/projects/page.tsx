import Header from "@/components/Header";
import Link from "next/link";

export const metadata = {
  title: "Projects — Tensor",
  description: "Interactive projects and experiments from the AiM stack.",
};

const PROJECTS = [
  {
    id: "draw",
    name: "DRAW",
    description: "Vector drawing studio with Apple Pencil support, editable paths, artboards, and SVG/PNG export.",
    href: "/draw",
    tag: "DESIGN / VECTOR",
  },
  {
    id: "key-viz",
    name: "Key·Viz",
    description: "Spectral MIDI keyboard visualizer — real-time piano heatmaps with harmonic analysis.",
    href: "/key-viz",
    tag: "AUDIO / VIZ",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-32 px-8 max-w-7xl mx-auto w-full">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="operator-text text-[10px] text-[#666] hover:text-white transition-colors"
            >
              ← OPERATOR GATEWAY
            </Link>
          </div>
          <h2 className="operator-text text-[#666] text-sm mb-4">Lab</h2>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">Projects</h1>
          <p className="text-[#888] text-lg max-w-2xl">
            Interactive experiments, tools, and visualizers built across the AiM stack.
          </p>
        </section>

        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROJECTS.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                className="operator-card p-6 flex flex-col gap-3 hover:border-[#f59e0b]/40 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="operator-text text-[9px] text-[#f59e0b]">{p.tag}</span>
                  <span className="operator-text text-[9px] text-[#444] group-hover:text-[#666] transition-colors">
                    OPEN →
                  </span>
                </div>
                <h3 className="text-white font-medium text-lg">{p.name}</h3>
                <p className="text-[#666] text-sm leading-relaxed">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-8 py-12 border-t border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] text-[#444] operator-text">
          SYS / PROJECTS · © 2026 TENSOR CORP
        </div>
        <div className="flex gap-8 text-[10px] text-[#444] operator-text">
          <Link href="/" className="hover:text-white transition-colors">
            Gateway
          </Link>
        </div>
      </footer>
    </div>
  );
}
