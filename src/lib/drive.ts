const DRIVE_API = "https://www.googleapis.com/drive/v3";

export type DriveFile = {
  id: string;
  name: string;
  modifiedTime: string;
  mimeType: string;
};

export type DirReport = {
  file: DriveFile;
  html: string;
};

function requireEnv() {
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
  const folderId = process.env.DIR_FOLDER_ID;
  const missing: string[] = [];
  if (!apiKey) missing.push("GOOGLE_DRIVE_API_KEY");
  if (!folderId) missing.push("DIR_FOLDER_ID");
  if (missing.length > 0) return { missing };
  return { apiKey: apiKey!, folderId: folderId! };
}

async function listFolder(folderId: string, apiKey: string): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and trashed = false`,
    orderBy: "modifiedTime desc",
    pageSize: "20",
    fields: "files(id,name,modifiedTime,mimeType)",
    key: apiKey,
  });
  const res = await fetch(`${DRIVE_API}/files?${params}`, {
    next: { revalidate: 300, tags: ["dir-folder"] },
  });
  if (!res.ok) {
    throw new Error(`Drive list failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { files?: DriveFile[] };
  return data.files ?? [];
}

async function downloadFile(fileId: string, apiKey: string): Promise<string> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media&key=${apiKey}`, {
    next: { revalidate: 300, tags: [`dir-file-${fileId}`] },
  });
  if (!res.ok) {
    throw new Error(`Drive download failed: ${res.status} ${await res.text()}`);
  }
  return res.text();
}

export async function getLatestDirReport(): Promise<
  | { ok: true; data: DirReport; siblings: DriveFile[] }
  | { ok: false; reason: "unconfigured"; missing: string[] }
  | { ok: false; reason: "empty" | "error"; message?: string }
> {
  const env = requireEnv();
  if ("missing" in env) return { ok: false, reason: "unconfigured", missing: env.missing };

  try {
    const files = await listFolder(env.folderId, env.apiKey);
    const html = files.filter((f) => f.mimeType === "text/html" || f.name.endsWith(".html"));
    if (html.length === 0) return { ok: false, reason: "empty" };
    const latest = html[0];
    const content = await downloadFile(latest.id, env.apiKey);
    return { ok: true, data: { file: latest, html: content }, siblings: html.slice(0, 10) };
  } catch (e) {
    return { ok: false, reason: "error", message: e instanceof Error ? e.message : String(e) };
  }
}
