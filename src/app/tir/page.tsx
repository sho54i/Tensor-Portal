import Header from "@/components/Header";
import Link from "next/link";
import { getTirReport } from "@/lib/drive";

export const metadata = {
  title: "TIR — Technology Investigative Reports",
  description: "Technology Investigative Reports from Dragon Investigation Group (DIG).",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Seed edition shown until the daily TIR routine populates the Drive folder.
const SEED_SRC = "/tir/x402-folio.html";
const SEED_NAME = "x402-folio.html";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

export default async function TirPage({
  searchParams,
}: {
  searchParams: Promise<{ file?: string }>;
}) {
  const { file } = await searchParams;
  const result = await getTirReport(file);

  // TIR reports are self-contained, fully-styled space-grey folios — render them
  // as-is (no theme injection, unlike /dir which restyles markdown exports).
  const showSeed = !result.ok && (result.reason === "empty" || result.reason === "unconfigured");

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
            <span className="operator-text text-[10px] text-[#444]">
              DRAGON INVESTIGATION GROUP · DIG
            </span>
          </div>
          <h2 className="operator-text text-[#666] text-sm mb-4">Technology Investigative Reports</h2>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">TIR</h1>
          <p className="text-[#888] text-lg max-w-2xl">
            Daily technical intelligence on LLM browser automation, agent tool use and the MCP
            ecosystem, AI web scraping, and implementation news — sourced via live web sweeps and
            rendered as a self-contained space-grey folio with an Implementation Spotlight.
          </p>
        </section>

        {result.ok ? (
          <>
            <section className="mb-4">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
                <div>
                  <h3 className="operator-text text-xs text-[#666] mb-1">
                    {result.isLatest ? "Latest Edition" : "Archived Edition"}
                  </h3>
                  <p className="text-white text-sm font-mono">{result.data.file.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  {!result.isLatest && (
                    <Link
                      href="/tir"
                      className="operator-text text-[10px] text-[#00c9b1] hover:text-[#00d9f5] transition-colors"
                    >
                      ↻ JUMP TO LATEST
                    </Link>
                  )}
                  <span className="text-[10px] text-[#444] font-mono">
                    {formatTime(result.data.file.modifiedTime)}
                  </span>
                </div>
              </div>
            </section>

            <section className="mb-12 operator-card overflow-hidden">
              <iframe
                title={result.data.file.name}
                srcDoc={result.data.html}
                sandbox="allow-same-origin"
                className="w-full bg-black"
                style={{ height: "82vh", border: 0 }}
              />
            </section>

            {result.siblings.length > 1 && (
              <section className="mb-24">
                <div className="flex items-center justify-between mb-4 border-b border-[#1f1f1f] pb-4">
                  <h3 className="operator-text text-xs text-[#666]">Archive</h3>
                  <span className="text-[10px] text-[#444] font-mono">
                    {result.siblings.length} EDITIONS
                  </span>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.siblings.map((f) => {
                    const isCurrent = f.id === result.data.file.id;
                    return (
                      <li key={f.id}>
                        {isCurrent ? (
                          <div className="operator-card p-4 flex items-center justify-between border-[#00c9b1]/40 bg-[#00c9b1]/[0.04]">
                            <span className="text-sm font-mono text-white truncate">{f.name}</span>
                            <span className="operator-text text-[9px] text-[#00c9b1] shrink-0 ml-4">
                              NOW VIEWING
                            </span>
                          </div>
                        ) : (
                          <Link
                            href={`/tir?file=${f.id}`}
                            className="operator-card p-4 flex items-center justify-between hover:border-[#00c9b1]/40 hover:bg-white/[0.02] transition-colors"
                          >
                            <span className="text-sm font-mono text-[#ddd] truncate">{f.name}</span>
                            <span className="text-[10px] text-[#444] font-mono shrink-0 ml-4">
                              {formatTime(f.modifiedTime)}
                            </span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </>
        ) : showSeed ? (
          <>
            <section className="mb-4">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
                <div>
                  <h3 className="operator-text text-xs text-[#666] mb-1">Seed Edition</h3>
                  <p className="text-white text-sm font-mono">{SEED_NAME}</p>
                </div>
                <span className="operator-text text-[9px] text-[#00c9b1]">
                  AWAITING FIRST ROUTINE RUN
                </span>
              </div>
            </section>

            <section className="mb-24 operator-card overflow-hidden">
              <iframe
                title={SEED_NAME}
                src={SEED_SRC}
                sandbox="allow-same-origin"
                className="w-full bg-black"
                style={{ height: "82vh", border: 0 }}
              />
            </section>
          </>
        ) : (
          <section className="mb-24 operator-card p-8">
            {result.reason === "not_found" && (
              <>
                <h3 className="operator-text text-xs text-[#666] mb-4">Edition Not Found</h3>
                <p className="text-[#888] text-sm mb-4">
                  No edition with id <code className="text-white font-mono">{result.message}</code>{" "}
                  in the archive. It may have been removed or the link is stale.
                </p>
                <Link
                  href="/tir"
                  className="operator-text text-[10px] text-[#00c9b1] hover:text-[#00d9f5] transition-colors"
                >
                  ↻ JUMP TO LATEST
                </Link>
              </>
            )}
            {result.reason === "error" && (
              <>
                <h3 className="operator-text text-xs text-[#666] mb-4">Bridge Error</h3>
                <p className="text-[#888] text-sm font-mono break-all">{result.message}</p>
              </>
            )}
          </section>
        )}
      </main>

      <footer className="px-8 py-12 border-t border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] text-[#444] operator-text">
          SYS / TIR · © 2026 TENSOR CORP
        </div>
        <div className="flex gap-8 text-[10px] text-[#444] operator-text">
          <Link href="/" className="hover:text-white transition-colors">
            Gateway
          </Link>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
