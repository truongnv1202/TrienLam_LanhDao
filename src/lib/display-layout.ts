import type { Leader, LeaderDisplaySection } from "@/types";

export type VisibleLeaderDisplaySection = Exclude<LeaderDisplaySection, "hidden">;

export const DISPLAY_SECTION_LABELS: Record<LeaderDisplaySection, string> = {
  party: "Lãnh đạo Đảng, Nhà nước",
  minister: "Bộ trưởng",
  "deputy-1": "Thứ trưởng hàng 1",
  "deputy-2": "Thứ trưởng hàng 2",
  hidden: "Không hiển thị",
};

export const VISIBLE_DISPLAY_SECTIONS: VisibleLeaderDisplaySection[] = [
  "party",
  "minister",
  "deputy-1",
  "deputy-2",
];

export function isVisibleDisplaySection(
  section: LeaderDisplaySection | undefined
): section is VisibleLeaderDisplaySection {
  return (
    section !== undefined &&
    VISIBLE_DISPLAY_SECTIONS.includes(section as VisibleLeaderDisplaySection)
  );
}

export const LEADER_NAME_BY_ID: Record<string, string> = {
  "tran-quoc-hoan": "Trần Quốc Hoàn",
  "pham-hung": "Phạm Hùng",
  "tran-dai-quang": "Trần Đại Quang",
  "to-lam": "Tô Lâm",
  "pham-minh-chinh": "Phạm Minh Chính",
  "le-gian": "Lê Giản",
  "mai-chi-tho": "Mai Chí Thọ",
  "bui-thien-ngo": "Bùi Thiện Ngộ",
  "le-minh-huong": "Lê Minh Hương",
  "le-hong-anh": "Lê Hồng Anh",
  "luong-tam-quang": "Lương Tam Quang",
  "le-quoc-than": "Lê Quốc Thân",
  "ngo-ngoc-du": "Ngô Ngọc Du",
  "nguyen-quang-viet": "Nguyễn Quang Việt",
  "tran-quyet": "Trần Quyết",
  "vien-chi": "Viễn Chi",
  "hoang-thao": "Hoàng Thao",
  "cao-dang-chiem": "Cao Đăng Chiếm",
  "nguyen-tai": "Nguyễn Tài",
  "nguyen-minh-tien": "Nguyễn Minh Tiến",
  "lam-van-ta": "Lâm Văn Tà",
  "vo-viet-thanh": "Võ Viết Thanh",
  "nguyen-khanh-toan": "Nguyễn Khánh Toàn",
  "nguyen-van-huong": "Nguyễn Văn Hưởng",
  "thi-van-tam": "Thi Văn Tám",
  "bui-van-nam": "Bùi Văn Nam",
  "pham-dung": "Phạm Dũng",
  "pham-the-tung": "Phạm Thế Tùng",
  "dang-hong-duc": "Đặng Hồng Đức",
};

export const DEFAULT_DISPLAY_BY_ID: Record<
  string,
  { section: VisibleLeaderDisplaySection; order: number }
> = {
  "tran-quoc-hoan": { section: "party", order: 1 },
  "pham-hung": { section: "party", order: 2 },
  "tran-dai-quang": { section: "party", order: 3 },
  "to-lam": { section: "party", order: 4 },
  "pham-minh-chinh": { section: "party", order: 5 },
  "le-gian": { section: "minister", order: 1 },
  "mai-chi-tho": { section: "minister", order: 2 },
  "bui-thien-ngo": { section: "minister", order: 3 },
  "le-minh-huong": { section: "minister", order: 4 },
  "le-hong-anh": { section: "minister", order: 5 },
  "luong-tam-quang": { section: "minister", order: 6 },
  "le-quoc-than": { section: "deputy-1", order: 1 },
  "ngo-ngoc-du": { section: "deputy-1", order: 2 },
  "nguyen-quang-viet": { section: "deputy-1", order: 3 },
  "tran-quyet": { section: "deputy-1", order: 4 },
  "vien-chi": { section: "deputy-1", order: 5 },
  "hoang-thao": { section: "deputy-1", order: 6 },
  "cao-dang-chiem": { section: "deputy-1", order: 7 },
  "nguyen-tai": { section: "deputy-1", order: 8 },
  "nguyen-minh-tien": { section: "deputy-1", order: 9 },
  "lam-van-ta": { section: "deputy-2", order: 1 },
  "vo-viet-thanh": { section: "deputy-2", order: 2 },
  "nguyen-khanh-toan": { section: "deputy-2", order: 3 },
  "nguyen-van-huong": { section: "deputy-2", order: 4 },
  "thi-van-tam": { section: "deputy-2", order: 5 },
  "bui-van-nam": { section: "deputy-2", order: 6 },
  "pham-dung": { section: "deputy-2", order: 7 },
  "pham-the-tung": { section: "deputy-2", order: 8 },
  "dang-hong-duc": { section: "deputy-2", order: 9 },
};

export function normalizeLeaderName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

export function getDefaultDisplayConfig(
  leader: Pick<Leader, "id" | "name">
): { section: VisibleLeaderDisplaySection; order: number } | undefined {
  const direct = DEFAULT_DISPLAY_BY_ID[leader.id];
  if (direct) return direct;

  const normalizedName = normalizeLeaderName(leader.name);
  const matchedId = Object.entries(LEADER_NAME_BY_ID).find(
    ([, name]) => normalizeLeaderName(name) === normalizedName
  )?.[0];
  return matchedId ? DEFAULT_DISPLAY_BY_ID[matchedId] : undefined;
}
