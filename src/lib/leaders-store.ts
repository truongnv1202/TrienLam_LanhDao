import { promises as fs } from "fs";
import path from "path";
import type { Leader } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leaders.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "portraits");

export const SEED_LEADERS: Leader[] = [
  {
    id: "leader-to-lam",
    name: "Đại tướng Tô Lâm",
    position: "Ủy viên Bộ Chính trị, Bí thư Trung ương Đảng",
    portraitUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=520&fit=crop&crop=face",
    biography:
      "Đồng chí Tô Lâm sinh năm 1957, quê quán tỉnh Hưng Yên. Trải qua nhiều vị trí lãnh đạo trong lực lượng Công an nhân dân, góp phần xây dựng lực lượng Công an cách mạng, chính quy, tinh nhuệ, từng bước hiện đại, góp phần giữ vững an ninh quốc gia, bảo đảm trật tự, an toàn xã hội và phục vụ công tác xây dựng, bảo vệ Tổ quốc.",
    tier: "top",
    timeline: [
      {
        year: "1974",
        event: "Gia nhập lực lượng Công an",
        description:
          "Bắt đầu sự nghiệp trong ngành Công an, được đào tạo nền tảng về nghiệp vụ an ninh và xây dựng phong cách người chiến sĩ Công an nhân dân.",
      },
      {
        year: "2010",
        event: "Giữ chức vụ lãnh đạo cấp cao Bộ Công an",
        description:
          "Đảm nhận các trọng trách lãnh đạo, chỉ đạo công tác đảm bảo an ninh quốc gia, trật tự an toàn xã hội trên phạm vi toàn quốc.",
      },
      {
        year: "2024",
        event: "Được phong cấp Đại tướng",
        description:
          "Được Quốc hội phê chuẩn giữ chức vụ Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam, tiếp tục cống hiến cho sự nghiệp xây dựng và bảo vệ Tổ quốc.",
      },
    ],
  },
  {
    id: "leader-bui-thien-ngo",
    name: "Thượng tướng Bùi Thiện Ngộ",
    position: "Thứ trưởng Bộ Công an",
    portraitUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=520&fit=crop&crop=face",
    biography:
      "Đồng chí Bùi Thiện Ngộ sinh năm 1961, có nhiều năm công tác trong lực lượng Công an nhân dân. Luôn gương mẫu, trách nhiệm cao trong công tác xây dựng Đảng, xây dựng lực lượng; góp phần thực hiện hiệu quả các chủ trương của Đảng, Nhà nước về bảo đảm an ninh, trật tự và phục vụ nhân dân.",
    tier: "top",
    timeline: [
      {
        year: "1983",
        event: "Vào ngành Công an",
        description:
          "Bắt đầu công tác tại địa phương, trực tiếp tham gia công tác đảm bảo an ninh trật tự ở cơ sở.",
      },
      {
        year: "2015",
        event: "Đảm nhiệm chức vụ Tổng cục trưởng",
        description:
          "Lãnh đạo, chỉ đạo các mặt công tác chuyên môn, góp phần nâng cao hiệu quả đấu tranh phòng chống tội phạm.",
      },
      {
        year: "2020",
        event: "Được phong cấp Thượng tướng",
        description:
          "Tiếp tục giữ trọng trách Thứ trưởng Bộ Công an, tham gia chỉ đạo các lĩnh vực then chốt của ngành.",
      },
    ],
  },
  {
    id: "leader-le-minh-huong",
    name: "Thượng tướng Lê Minh Hương",
    position: "Thứ trưởng Bộ Công an",
    portraitUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=520&fit=crop&crop=face",
    biography:
      "Đồng chí Lê Minh Hương sinh năm 1960, có bề dày kinh nghiệm trong công tác an ninh, trật tự. Luôn bám sát chủ trương của Đảng, chính sách, pháp luật của Nhà nước; góp phần xây dựng lực lượng Công an vững mạnh, gần gũi và phục vụ nhân dân.",
    tier: "bottom",
    timeline: [
      {
        year: "1982",
        event: "Công tác tại Công an địa phương",
        description:
          "Trực tiếp tham gia công tác bảo vệ an ninh trật tự, xây dựng mô hình an ninh cơ sở tại các địa phương.",
      },
      {
        year: "2012",
        event: "Giữ chức vụ lãnh đạo Tổng cục",
        description:
          "Chỉ đạo công tác chuyên môn, đổi mới phương thức hoạt động, ứng dụng công nghệ trong quản lý nhà nước về an ninh trật tự.",
      },
      {
        year: "2019",
        event: "Phong cấp Thượng tướng",
        description:
          "Được giao trọng trách Thứ trưởng Bộ Công an, tham gia chỉ đạo, điều hành các mặt công tác của ngành.",
      },
    ],
  },
];

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(SEED_LEADERS, null, 2), "utf-8");
  }
}

export async function readLeaders(): Promise<Leader[]> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [...SEED_LEADERS];
  return parsed as Leader[];
}

export async function writeLeaders(leaders: Leader[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(leaders, null, 2), "utf-8");
}

export function sortLeaders(leaders: Leader[]): Leader[] {
  return [...leaders].sort((a, b) => {
    if (a.tier === b.tier) return a.name.localeCompare(b.name, "vi");
    return a.tier === "top" ? -1 : 1;
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
