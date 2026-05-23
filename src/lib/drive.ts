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

export async function getDirReport(fileId?: string): Promise<
  | { ok: true; data: DirReport; siblings: DriveFile[]; isLatest: boolean }
  | { ok: false; reason: "unconfigured"; missing: string[] }
  | { ok: false; reason: "empty" | "not_found" | "error"; message?: string }
> {
  const env = requireEnv();
  if ("missing" in env) return { ok: false, reason: "unconfigured", missing: env.missing };

  try {
    const files = await listFolder(env.folderId, env.apiKey);
    const html = files.filter((f) => f.mimeType === "text/html" || f.name.endsWith(".html"));
    if (html.length === 0) return { ok: false, reason: "empty" };

    const target = fileId ? html.find((f) => f.id === fileId) : html[0];
    if (!target) return { ok: false, reason: "not_found", message: fileId };

    const content = await downloadFile(target.id, env.apiKey);
    return {
      ok: true,
      data: { file: target, html: content },
      siblings: html,
      isLatest: target.id === html[0].id,
    };
  } catch (e) {
    return { ok: false, reason: "error", message: e instanceof Error ? e.message : String(e) };
  }
}
