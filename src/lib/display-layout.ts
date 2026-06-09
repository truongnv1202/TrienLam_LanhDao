import type { Leader, LeaderDisplaySection } from "@/types";

export type VisibleLeaderDisplaySection = Exclude<LeaderDisplaySection, "hidden">;
export type ExhibitionTabId = "ministers" | "deputies";

export interface ExhibitionTabDefinition {
  id: ExhibitionTabId;
  label: string;
  leaderIds: string[];
  columns: number;
}

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

export const MINISTER_TAB_LEADER_IDS = [
  "le-gian",
  "tran-quoc-hoan",
  "pham-hung",
  "mai-chi-tho",
  "bui-thien-ngo",
  "le-minh-huong",
  "le-hong-anh",
  "tran-dai-quang",
  "to-lam",
  "luong-tam-quang",
];

export const DEPUTY_TAB_LEADER_IDS = [
  "pham-trong-tue",
  "le-quoc-than",
  "ngo-ngoc-du",
  "dang-ky",
  "nguyen-quang-viet",
  "tran-quyet",
  "vien-chi",
  "hoang-thao",
  "cao-dang-chiem",
  "nguyen-tai",
  "nguyen-minh-tien",
  "tran-dong",
  "nguyen-van-duc",
  "lam-van-the",
  "pham-tam-long",
  "vo-viet-thanh",
  "vu-thai-hoa",
  "nguyen-tan-dung",
  "nguyen-khanh-toan",
  "le-the-tiem",
  "nguyen-van-tinh",
  "nguyen-van-ro",
  "nguyen-van-huong",
  "thi-van-tam",
  "dang-van-hieu",
  "bui-van-nam",
  "le-quy-vuong",
  "pham-minh-chinh",
  "pham-quy-ngo",
  "bui-quang-ben",
  "nguyen-van-thanh",
  "pham-dung",
  "nguyen-van-son",
  "nguyen-ngoc-duy",
  "le-quoc-hung",
  "le-tan-toi",
  "tran-quoc-to",
  "le-van-tuyen",
  "nguyen-van-long",
  "pham-the-tung",
  "nguyen-ngoc-lam",
  "dang-hong-duc",
];

export const EXHIBITION_TABS: ExhibitionTabDefinition[] = [
  {
    id: "ministers",
    label: "Bộ trưởng Bộ Công an qua các thời kỳ",
    leaderIds: MINISTER_TAB_LEADER_IDS,
    columns: 5,
  },
  {
    id: "deputies",
    label: "Thứ trưởng Bộ Công an qua các thời kỳ",
    leaderIds: DEPUTY_TAB_LEADER_IDS,
    columns: 11,
  },
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
  "pham-trong-tue": "Phạm Trọng Tuệ",
  "le-quoc-than": "Lê Quốc Thân",
  "ngo-ngoc-du": "Ngô Ngọc Du",
  "dang-ky": "Đặng Kỷ",
  "nguyen-quang-viet": "Nguyễn Quang Việt",
  "tran-quyet": "Trần Quyết",
  "vien-chi": "Viễn Chi",
  "hoang-thao": "Hoàng Thao",
  "cao-dang-chiem": "Cao Đăng Chiếm",
  "nguyen-tai": "Nguyễn Tài",
  "nguyen-minh-tien": "Nguyễn Minh Tiến",
  "tran-dong": "Trần Đông",
  "nguyen-van-duc": "Nguyễn Văn Đức",
  "lam-van-the": "Lâm Văn Thê",
  "pham-tam-long": "Phạm Tâm Long",
  "vo-viet-thanh": "Võ Viết Thanh",
  "vu-thai-hoa": "Vũ Thái Hòa",
  "nguyen-tan-dung": "Nguyễn Tấn Dũng",
  "nguyen-khanh-toan": "Nguyễn Khánh Toàn",
  "le-the-tiem": "Lê Thế Tiệm",
  "nguyen-van-tinh": "Nguyễn Văn Tính",
  "nguyen-van-ro": "Nguyễn Văn Rỡ",
  "nguyen-van-huong": "Nguyễn Văn Hưởng",
  "thi-van-tam": "Thi Văn Tám",
  "dang-van-hieu": "Đặng Văn Hiếu",
  "bui-van-nam": "Bùi Văn Nam",
  "le-quy-vuong": "Lê Quý Vương",
  "pham-quy-ngo": "Phạm Quý Ngọ",
  "bui-quang-ben": "Bùi Quang Bền",
  "nguyen-van-thanh": "Nguyễn Văn Thành",
  "pham-dung": "Phạm Dũng",
  "nguyen-van-son": "Nguyễn Văn Sơn",
  "nguyen-ngoc-duy": "Nguyễn Ngọc Duy",
  "le-quoc-hung": "Lê Quốc Hùng",
  "le-tan-toi": "Lê Tấn Tới",
  "tran-quoc-to": "Trần Quốc Tỏ",
  "le-van-tuyen": "Lê Văn Tuyến",
  "nguyen-van-long": "Nguyễn Văn Long",
  "pham-the-tung": "Phạm Thế Tùng",
  "nguyen-ngoc-lam": "Nguyễn Ngọc Lâm",
  "dang-hong-duc": "Đặng Hồng Đức",
};

export const DEFAULT_DISPLAY_BY_ID: Record<
  string,
  { section: VisibleLeaderDisplaySection; order: number }
> = {
  ...Object.fromEntries(
    MINISTER_TAB_LEADER_IDS.map((id, index) => [
      id,
      { section: "minister" as const, order: index + 1 },
    ])
  ),
  ...Object.fromEntries(
    DEPUTY_TAB_LEADER_IDS.map((id, index) => [
      id,
      {
        section: (index < 22 ? "deputy-1" : "deputy-2") as const,
        order: index + 1,
      },
    ])
  ),
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
