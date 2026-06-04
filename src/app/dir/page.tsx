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

// ── ENT-EVE · Muted mode ─────────────────────────────────────────────
// DIR reports are markdown exports, so this themes generic semantic tags
// (not eve- classes). Muted = the monochrome sibling of the vivid TIR/x402
// folio: Space Grey foundation, black & white type, exactly one teal
// hairline of chroma. See docs/ent-eve.md › §7 and public/ent-eve.css.
const REPORT_THEME_CSS = `<style>
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
  :root {
    color-scheme: dark;
    --bg:         #0c0d0f;
    --surface:    #171b22;
    --raised:     #1e2330;
    --base:       #111318;
    --border:     #252c3a;
    --border-mid: #2e3748;
    --text:       #d6dce7;
    --text-strong:#f3f6fb;
    --text-muted: #707d92;
    --hairline:   #009e8c;   /* the single surviving teal thread */
    --link:       #5fb3a8;
    --link-hi:    #00c9b1;
    --display: 'Syne', ui-sans-serif, system-ui, sans-serif;
    --mono: 'IBM Plex Mono', ui-monospace, "Geist Mono", monospace;
    --body: ui-sans-serif, -apple-system, system-ui, "Segoe UI", sans-serif;
  }
  html, body {
    background: var(--bg) !important;
    color: var(--text) !important;
    font-family: var(--body) !important;
    font-size: 15px;
    line-height: 1.78;
    -webkit-font-smoothing: antialiased;
  }
  body {
    max-width: 820px !important;
    margin: 0 auto !important;
    padding: 52px 36px 112px !important;
  }
  ::selection { background: rgba(0,201,177,0.22); color: #fff; }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--display) !important;
    color: var(--text-strong) !important;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  h1 {
    font-weight: 800; font-size: 2.5rem; margin: 0 0 0.6em;
    letter-spacing: -0.035em;
    background: linear-gradient(135deg, var(--text-strong) 45%, var(--hairline) 130%);
    -webkit-background-clip: text; background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  h2 {
    font-weight: 700; font-size: 1.55rem;
    margin: 2.4em 0 0.8em; padding-top: 1.6em;
    border-top: 1px solid var(--border) !important;
  }
  h2::before {                       /* the one teal tick per section */
    content: ''; display: block;
    width: 34px; height: 2px; margin-bottom: 1em;
    background: var(--hairline);
  }
  h3 { font-weight: 600; font-size: 1.2rem; margin: 1.8em 0 0.6em; }
  h4 {
    font-family: var(--mono) !important; font-weight: 500; font-size: 0.72rem;
    text-transform: uppercase; letter-spacing: 0.18em;
    color: var(--text-muted) !important; margin: 1.6em 0 0.5em;
  }
  p { margin: 0 0 1.05em; }
  strong, b { color: var(--text-strong) !important; font-weight: 700; }
  em { color: #c3cbda; }
  small { color: var(--text-muted); }

  a { color: var(--link) !important; text-decoration: none; border-bottom: 1px solid rgba(0,158,140,0.3); transition: color .15s, border-color .15s; }
  a:hover { color: var(--link-hi) !important; border-bottom-color: var(--link-hi); }

  ul, ol { padding-left: 1.4em; margin: 0 0 1.1em; }
  li { margin: 0.3em 0; }
  li::marker { color: var(--hairline); }

  code {
    font-family: var(--mono) !important;
    background: var(--raised) !important;
    color: #c5cedd !important;
    border: 1px solid var(--border) !important;
    border-radius: 3px; padding: 0.08em 0.4em; font-size: 0.86em;
  }
  pre {
    background: var(--base) !important;
    border: 1px solid var(--border-mid) !important;
    border-radius: 5px; padding: 18px 20px; overflow-x: auto;
    margin: 1.4em 0; font-family: var(--mono) !important;
    font-size: 0.82rem; line-height: 1.7;
  }
  pre code { background: transparent !important; border: 0 !important; padding: 0; color: #c9d2e1 !important; font-size: inherit; }

  table { border-collapse: collapse; width: 100%; margin: 1.5em 0; font-size: 0.86rem; }
  thead th {
    font-family: var(--mono) !important; font-size: 0.66rem;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--text-muted) !important; text-align: left;
    background: var(--surface) !important;
    padding: 10px 16px !important;
    border: 0 !important; border-bottom: 1px solid var(--border-mid) !important;
  }
  tbody tr { border-bottom: 1px solid var(--border) !important; transition: background .15s; }
  tbody tr:hover { background: var(--surface) !important; }
  td { padding: 11px 16px !important; border: 0 !important; color: var(--text) !important; vertical-align: top; }
  td:first-child { font-family: var(--mono) !important; color: #9fb6c8 !important; font-size: 0.8rem; }

  blockquote {                       /* → ent-eve callout */
    background: var(--surface) !important;
    border: 1px solid var(--border-mid) !important;
    border-left: 3px solid var(--hairline) !important;
    border-radius: 4px;
    margin: 1.5em 0; padding: 18px 22px;
    color: #aab4c6 !important;
  }
  blockquote p:last-child { margin-bottom: 0; }

  hr { border: 0; height: 1px; margin: 2.4em 0; background: linear-gradient(to right, var(--hairline), var(--border) 40%, transparent); }

  img { max-width: 100%; height: auto; border-radius: 6px; border: 1px solid var(--border); }
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
