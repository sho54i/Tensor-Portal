import Header from "@/components/Header";
import Link from "next/link";
import { getDirReport } from "@/lib/drive";

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

const REPORT_THEME_CSS = `<style>
  :root { color-scheme: dark; }
  html, body {
    background: #000 !important;
    color: #ededed !important;
    font-family: ui-sans-serif, -apple-system, system-ui, sans-serif !important;
  }
  h1, h2, h3, h4, h5, h6 { color: #fff !important; }
  a { color: #f59e0b !important; text-decoration: none; }
  a:hover { color: #fbbf24 !important; text-decoration: underline; }
  code, pre {
    background: #111 !important;
    color: #e4e4e7 !important;
    border: 1px solid #1f1f1f !important;
    border-radius: 4px;
    font-family: ui-monospace, "Geist Mono", monospace !important;
  }
  code { padding: 0.1em 0.35em; }
  pre { padding: 12px; overflow-x: auto; }
  pre code { background: transparent !important; border: 0 !important; padding: 0; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid #1f1f1f !important; padding: 6px 10px; }
  th { background: #0a0a0a !important; color: #fff !important; }
  blockquote {
    border-left: 3px solid #f59e0b !important;
    padding-left: 12px;
    color: #aaa !important;
    margin-left: 0;
  }
  hr { border: 0; border-top: 1px solid #1f1f1f !important; }
</style>`;

function themeReport(html: string): string {
  if (html.includes("</head>")) return html.replace("</head>", `${REPORT_THEME_CSS}</head>`);
  if (html.includes("<body")) return html.replace(/<body([^>]*)>/, `<body$1>${REPORT_THEME_CSS}`);
  return REPORT_THEME_CSS + html;
}

export default async function DirPage({
  searchParams,
}: {
  searchParams: Promise<{ file?: string }>;
}) {
  const { file } = await searchParams;
  const result = await getDirReport(file);

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
                  <h3 className="operator-text text-xs text-[#666] mb-1">
                    {result.isLatest ? "Latest Edition" : "Archived Edition"}
                  </h3>
                  <p className="text-white text-sm font-mono">{result.data.file.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  {!result.isLatest && (
                    <Link
                      href="/dir"
                      className="operator-text text-[10px] text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
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
                srcDoc={themeReport(result.data.html)}
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
                    const inner = (
                      <>
                        <span className="text-sm font-mono text-[#ddd] truncate">{f.name}</span>
                        <span className="text-[10px] text-[#444] font-mono shrink-0 ml-4">
                          {formatTime(f.modifiedTime)}
                        </span>
                      </>
                    );
                    return (
                      <li key={f.id}>
                        {isCurrent ? (
                          <div className="operator-card p-4 flex items-center justify-between border-[#f59e0b]/40 bg-[#f59e0b]/[0.04]">
                            <span className="text-sm font-mono text-white truncate">{f.name}</span>
                            <span className="operator-text text-[9px] text-[#f59e0b] shrink-0 ml-4">
                              NOW VIEWING
                            </span>
                          </div>
                        ) : (
                          <Link
                            href={`/dir?file=${f.id}`}
                            className="operator-card p-4 flex items-center justify-between hover:border-[#f59e0b]/40 hover:bg-white/[0.02] transition-colors"
                          >
                            {inner}
                          </Link>
                        )}
                      </li>
                    );
                  })}
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
            {result.reason === "not_found" && (
              <>
                <h3 className="operator-text text-xs text-[#666] mb-4">Edition Not Found</h3>
                <p className="text-[#888] text-sm mb-4">
                  No edition with id <code className="text-white font-mono">{result.message}</code>{" "}
                  in the archive. It may have been removed or the link is stale.
                </p>
                <Link
                  href="/dir"
                  className="operator-text text-[10px] text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
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
