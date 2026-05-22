import Header from "@/components/Header";
import Link from "next/link";
import { getLatestDirReport } from "@/lib/drive";

export const metadata = {
  title: "DIR — Daily Intelligence Report",
  description: "Daily Intelligence Report from Dragon Investigation Group.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace("T", " ").slice(0, 16) + " UTC";
}

export default async function DirPage() {
  const result = await getLatestDirReport();

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
            <span className="operator-text text-[10px] text-[#444]">DRAGON INVESTIGATION GROUP</span>
          </div>
          <h2 className="operator-text text-[#666] text-sm mb-4">Daily Intelligence Report</h2>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight mb-8">DIR</h1>
          <p className="text-[#888] text-lg max-w-2xl">
            Daily AI / tech / security intelligence digest. Two editions per day — AM briefing
            and PM follow-up — sourced via live web sweeps and flagged for security alerts,
            trending tech, and architecture notes.
          </p>
        </section>

        {result.ok ? (
          <>
            <section className="mb-4">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
                <div>
                  <h3 className="operator-text text-xs text-[#666] mb-1">Latest Edition</h3>
                  <p className="text-white text-sm font-mono">{result.data.file.name}</p>
                </div>
                <span className="text-[10px] text-[#444] font-mono">
                  {formatTime(result.data.file.modifiedTime)}
                </span>
              </div>
            </section>

            <section className="mb-12 operator-card overflow-hidden">
              <iframe
                title={result.data.file.name}
                srcDoc={result.data.html}
                sandbox="allow-same-origin"
                className="w-full bg-white"
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
                  {result.siblings.map((f) => (
                    <li
                      key={f.id}
                      className="operator-card p-4 flex items-center justify-between"
                    >
                      <span className="text-sm font-mono text-[#ddd]">{f.name}</span>
                      <span className="text-[10px] text-[#444] font-mono">
                        {formatTime(f.modifiedTime)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        ) : (
          <section className="mb-24 operator-card p-8">
            {result.reason === "unconfigured" && (
              <>
                <h3 className="operator-text text-xs text-[#666] mb-4">Configure Drive Access</h3>
                <p className="text-[#888] text-sm leading-relaxed mb-4">
                  Missing environment variable
                  {result.missing.length > 1 ? "s" : ""}:{" "}
                  {result.missing.map((m) => (
                    <code key={m} className="text-white font-mono mr-2">{m}</code>
                  ))}
                </p>
                <p className="text-[#666] text-xs font-mono">
                  DIR_FOLDER_ID=1Jr1y14cxOjy1VAy94HyQV_6PxX61_X3f
                </p>
              </>
            )}
            {result.reason === "empty" && (
              <>
                <h3 className="operator-text text-xs text-[#666] mb-4">No Reports Available</h3>
                <p className="text-[#888] text-sm">
                  The DIR folder is empty or the next run hasn&apos;t completed yet. Check back
                  after the next scheduled briefing.
                </p>
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
          SYS / DIR · © 2026 TENSOR CORP
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
