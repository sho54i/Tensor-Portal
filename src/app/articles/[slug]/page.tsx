import Header from "@/components/Header";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/articles";

export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article — Tensor" };
  return {
    title: `${article.title} — Tensor`,
    description: article.subtitle,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 pt-32 px-8 max-w-7xl mx-auto w-full">
        <section className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/articles"
              className="operator-text text-[10px] text-[#666] hover:text-white transition-colors"
            >
              ← FOLIO
            </Link>
            <span className="operator-text text-[10px] text-[#444]">{article.vol} · {article.date}</span>
          </div>
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
            <div>
              <h3 className="operator-text text-xs text-[#666] mb-1">Edition</h3>
              <p className="text-white text-sm font-mono">{article.title}</p>
            </div>
            <a
              href={article.htmlPath}
              target="_blank"
              rel="noopener noreferrer"
              className="operator-text text-[10px] text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
            >
              OPEN STANDALONE ↗
            </a>
          </div>
        </section>

        <section className="mb-24 operator-card overflow-hidden">
          <iframe
            title={article.title}
            src={article.htmlPath}
            sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="w-full bg-black"
            style={{ height: "85vh", border: 0 }}
          />
        </section>
      </main>

      <footer className="px-8 py-12 border-t border-[#1f1f1f] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-[10px] text-[#444] operator-text">
          SYS / FOLIO · © 2026 TENSOR CORP
        </div>
        <div className="flex gap-8 text-[10px] text-[#444] operator-text">
          <Link href="/" className="hover:text-white transition-colors">Gateway</Link>
          <Link href="/articles" className="hover:text-white transition-colors">Folio</Link>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}
