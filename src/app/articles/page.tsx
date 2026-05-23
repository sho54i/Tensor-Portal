import Header from "@/components/Header";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata = {
  title: "Articles — Tensor",
  description: "Long-form intelligence digests and technical writing.",
};

export default function ArticlesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-32 px-8 max-w-7xl mx-auto w-full">
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="operator-text text-[10px] text-[#666] hover:text-white transition-colors"
            >
              ← OPERATOR GATEWAY
            </Link>
            <span className="operator-text text-[10px] text-[#444]">TENSOR / FOLIO</span>
          </div>
          <h2 className="operator-text text-[#666] text-sm mb-4">Articles</h2>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">FOLIO</h1>
          <p className="text-[#888] text-lg max-w-2xl">
            Long-form digests covering cryptography, machine learning, and the
            infrastructure layer for autonomous agents.
          </p>
        </section>

        <section className="mb-24">
          <div className="flex items-center justify-between mb-8 border-b border-[#1f1f1f] pb-4">
            <h3 className="operator-text text-xs text-[#666]">Editions</h3>
            <span className="text-[10px] text-[#444] font-mono">{ARTICLES.length} ARTICLES</span>
          </div>

          <ul className="grid grid-cols-1 gap-4">
            {ARTICLES.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="operator-card p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 group hover:border-[#666] transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="operator-text text-[10px] text-[#666]">{a.vol}</span>
                      <span className="operator-text text-[10px] text-[#444]">{a.date}</span>
                    </div>
                    <h4 className="text-2xl font-medium mb-2 group-hover:text-[#f59e0b] transition-colors">
                      {a.title}
                    </h4>
                    <p className="text-[#888] text-sm leading-relaxed max-w-2xl mb-3">
                      {a.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {a.topics.map((t) => (
                        <span
                          key={t}
                          className="operator-text text-[9px] text-[#666] border border-[#1f1f1f] px-2 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#444] operator-text group-hover:text-white transition-colors">
                    READ <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="px-8 py-12 border-t border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] text-[#444] operator-text">
          SYS / FOLIO · © 2026 TENSOR CORP
        </div>
        <div className="flex gap-8 text-[10px] text-[#444] operator-text">
          <Link href="/" className="hover:text-white transition-colors">Gateway</Link>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
