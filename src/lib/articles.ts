export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  vol: string;
  date: string;
  topics: string[];
  htmlPath: string;
};

export const ARTICLES: Article[] = [
  {
    slug: "zk-snark-folio",
    title: "Ground Truth — Folio",
    subtitle: "Cryptography × zkML × Agentic Infrastructure",
    vol: "Vol. 03",
    date: "May 2026",
    topics: ["ZK-SNARKs", "ezkl", "Agent Stack"],
    htmlPath: "/articles/zk-snark-folio.html",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
