import { promises as fs } from "fs";
import path from "path";
import type { Leader } from "@/types";
import { SEED_LEADERS } from "@/lib/seed";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leaders.json");
const SEED_FILE = path.join(DATA_DIR, "leaders.seed.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "portraits");

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    try {
      const seedRaw = await fs.readFile(SEED_FILE, "utf-8");
      await fs.writeFile(DATA_FILE, seedRaw, "utf-8");
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(SEED_LEADERS, null, 2), "utf-8");
    }
  }
}

export async function readLeaders(): Promise<Leader[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [...SEED_LEADERS];
  return await mergeSeedLeaders(parsed as Leader[]);
}

async function mergeSeedLeaders(current: Leader[]): Promise<Leader[]> {
  let changed = false;
  const byId = new Map(current.map((leader) => [leader.id, leader]));
  const merged = [...current];

  for (const seed of SEED_LEADERS) {
    const existing = byId.get(seed.id);

    if (!existing) {
      merged.push(seed);
      changed = true;
      continue;
    }

    const normalized: Leader = {
      ...existing,
      name: existing.name || seed.name,
      position: existing.position || seed.position,
      portraitUrl: existing.portraitUrl || seed.portraitUrl,
      biography: existing.biography || seed.biography,
      tier: existing.tier || seed.tier,
      sortOrder:
        typeof existing.sortOrder === "number" && existing.sortOrder > 0
          ? existing.sortOrder
          : seed.sortOrder,
      timeline: Array.isArray(existing.timeline) ? existing.timeline : seed.timeline,
      awards: Array.isArray(existing.awards) ? existing.awards : seed.awards,
    };

    if (JSON.stringify(existing) !== JSON.stringify(normalized)) {
      const index = merged.findIndex((leader) => leader.id === seed.id);
      merged[index] = normalized;
      changed = true;
    }
  }

  if (changed) {
    await fs.writeFile(DATA_FILE, JSON.stringify(merged, null, 2), "utf-8");
  }

  return merged;
}

export async function writeLeaders(leaders: Leader[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(leaders, null, 2), "utf-8");
}

export function sortLeaders(leaders: Leader[]): Leader[] {
  return [...leaders].sort((a, b) => {
    if (a.tier !== b.tier) return a.tier === "top" ? -1 : 1;
    const orderA = a.sortOrder ?? 999;
    const orderB = b.sortOrder ?? 999;
    return orderA - orderB;
  });
}

export async function getLeaderById(id: string): Promise<Leader | undefined> {
  const leaders = await readLeaders();
  return leaders.find((l) => l.id === id);
}

export async function upsertLeader(leader: Leader): Promise<Leader> {
  const leaders = await readLeaders();
  const index = leaders.findIndex((l) => l.id === leader.id);
  if (index >= 0) {
    leaders[index] = leader;
  } else {
    if (leaders.some((l) => l.id === leader.id)) {
      throw new Error("DUPLICATE_ID");
    }
    leaders.push(leader);
  }
  await writeLeaders(leaders);
  return leader;
}

export async function deleteLeader(id: string): Promise<Leader | null> {
  const leaders = await readLeaders();
  const index = leaders.findIndex((l) => l.id === id);
  if (index < 0) return null;
  const [removed] = leaders.splice(index, 1);
  await writeLeaders(leaders);
  await deletePortraitFileIfLocal(removed.portraitUrl);
  return removed;
}

export function isLocalPortraitUrl(url: string): boolean {
  return url.startsWith("/uploads/portraits/");
}

export async function deletePortraitFileIfLocal(portraitUrl: string): Promise<void> {
  if (!isLocalPortraitUrl(portraitUrl)) return;
  const filePath = path.join(process.cwd(), "public", portraitUrl.replace(/^\//, ""));
  try {
    await fs.unlink(filePath);
  } catch {
    /* file may not exist */
  }
}

export async function savePortraitFile(
  file: File,
  leaderId: string
): Promise<string> {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    throw new Error("INVALID_TYPE");
  }
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("FILE_TOO_LARGE");
  }

  const extMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
  };
  const ext = extMap[file.type] ?? ".jpg";
  const safeId = leaderId.replace(/[^a-zA-Z0-9-_]/g, "-");
  const filename = `${safeId}${ext}`;

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);

  return `/uploads/portraits/${filename}`;
}

/** Ghi đè data/leaders.json bằng dữ liệu mẫu ảnh */
export async function resetToSampleLeaders(): Promise<Leader[]> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(SEED_LEADERS, null, 2), "utf-8");
  await fs.writeFile(SEED_FILE, JSON.stringify(SEED_LEADERS, null, 2), "utf-8");
  return SEED_LEADERS;
}
