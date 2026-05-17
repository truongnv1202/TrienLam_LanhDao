import type { Leader } from "@/types";

const PLACEHOLDER = (id: string) => `/uploads/portraits/${id}.jpg`;

const bio = (name: string) =>
  `Đồng chí ${name} có nhiều năm công tác trong lực lượng Công an nhân dân, góp phần bảo đảm an ninh quốc gia, giữ vững trật tự an toàn xã hội.`;

const timeline = (year: string, event: string) => ({
  year,
  event,
  description: event,
});

/** 13 lãnh đạo theo ảnh mẫu — upload ảnh tại /uploads/portraits/{id}.jpg */
export const SAMPLE_LEADERS: Leader[] = [
  {
    id: "bui-thien-ngo",
    name: "Bùi Thiện Ngộ",
    position:
      "P.TC trưởng TC ANND (1985)\nUV Bộ Chính trị Khóa VII\nBộ trưởng Bộ NV (1991-1996)",
    portraitUrl: PLACEHOLDER("bui-thien-ngo"),
    biography: bio("Bùi Thiện Ngộ"),
    tier: "top",
    sortOrder: 1,
    timeline: [timeline("1985", "Phó Tổng cục trưởng TC ANND")],
  },
  {
    id: "le-minh-huong",
    name: "Lê Minh Hương",
    position:
      "P.TC trưởng, TC trưởng TC Tình báo (1988-1990)\nUV Bộ Chính trị khóa VII, IX\nBộ trưởng Bộ NV (1996-2002)",
    portraitUrl: PLACEHOLDER("le-minh-huong"),
    biography: bio("Lê Minh Hương"),
    tier: "top",
    sortOrder: 2,
    timeline: [timeline("1996", "Bộ trưởng Bộ Nội vụ")],
  },
  {
    id: "tran-dai-quang",
    name: "Trần Đại Quang",
    position:
      "P.TC trưởng TC An ninh\nThứ trưởng, Bộ trưởng Bộ CA\nUV Bộ Chính trị khóa XI, XII\nChủ tịch nước CHXHCN Việt Nam (2016-2018)",
    portraitUrl: PLACEHOLDER("tran-dai-quang"),
    biography: bio("Trần Đại Quang"),
    tier: "top",
    sortOrder: 3,
    timeline: [timeline("2016", "Chủ tịch nước")],
  },
  {
    id: "to-lam",
    name: "Tô Lâm",
    position:
      "TC trưởng TC An ninh\nThứ trưởng, Bộ trưởng Bộ CA\nUV Bộ Chính trị khóa XII, XIII\nChủ tịch nước & Tổng Bí thư BCH TW Đảng khóa XIII (2024 - Nay)",
    portraitUrl: PLACEHOLDER("to-lam"),
    biography: bio("Tô Lâm"),
    tier: "top",
    sortOrder: 4,
    timeline: [timeline("2024", "Chủ tịch nước")],
  },
  {
    id: "pham-minh-chinh",
    name: "Phạm Minh Chính",
    position:
      "P.TC trưởng TC V (2006)\nTC trưởng TC IV (2010)\nThứ trưởng Bộ CA (2010-2011)",
    portraitUrl: PLACEHOLDER("pham-minh-chinh"),
    biography: bio("Phạm Minh Chính"),
    tier: "top",
    sortOrder: 5,
    timeline: [timeline("2010", "Thứ trưởng Bộ Công an")],
  },
  {
    id: "luong-tam-quang",
    name: "Lương Tam Quang",
    position:
      "Thứ trưởng Bộ CA (2019)\nUV TW Đảng Khóa XIII\nBộ trưởng Bộ CA (2024)\nUV Bộ Chính trị khóa XIII",
    portraitUrl: PLACEHOLDER("luong-tam-quang"),
    biography: bio("Lương Tam Quang"),
    tier: "top",
    sortOrder: 6,
    timeline: [timeline("2024", "Bộ trưởng Bộ Công an")],
  },
  {
    id: "vo-viet-thanh",
    name: "Võ Viết Thanh",
    position: "TC trưởng TC ANND (1988)\nThứ trưởng Bộ NV (1988-1991)",
    portraitUrl: PLACEHOLDER("vo-viet-thanh"),
    biography: bio("Võ Viết Thanh"),
    tier: "bottom",
    sortOrder: 1,
    timeline: [timeline("1988", "Tổng cục trưởng TC ANND")],
  },
  {
    id: "nguyen-khanh-toan",
    name: "Nguyễn Khánh Toàn",
    position:
      "TC trưởng TC ANND (1989)\nThứ trưởng Bộ CA (1996)\nThứ trưởng Thường trực Bộ CA (1998-2011)",
    portraitUrl: PLACEHOLDER("nguyen-khanh-toan"),
    biography: bio("Nguyễn Khánh Toàn"),
    tier: "bottom",
    sortOrder: 2,
    timeline: [timeline("1996", "Thứ trưởng Bộ Công an")],
  },
  {
    id: "bui-van-nam",
    name: "Bùi Văn Nam",
    position:
      "P.TC trưởng, TC trưởng TC ANND (1989)\nThứ trưởng Bộ CA (1996)\nThứ trưởng Thường trực Bộ CA (1998-2011) - (2013-2021)",
    portraitUrl: PLACEHOLDER("bui-van-nam"),
    biography: bio("Bùi Văn Nam"),
    tier: "bottom",
    sortOrder: 3,
    timeline: [timeline("1996", "Thứ trưởng Bộ Công an")],
  },
  {
    id: "nguyen-van-huong",
    name: "Nguyễn Văn Hưởng",
    position: "TC trưởng TC An ninh (1997)\nThứ trưởng Bộ CA (2001-2011)",
    portraitUrl: PLACEHOLDER("nguyen-van-huong"),
    biography: bio("Nguyễn Văn Hưởng"),
    tier: "bottom",
    sortOrder: 4,
    timeline: [timeline("2001", "Thứ trưởng Bộ Công an")],
  },
  {
    id: "thi-van-tam",
    name: "Thi Văn Tám",
    position: "TC trưởng TC An ninh (2001)\nThứ trưởng Bộ CA (2006-2008)",
    portraitUrl: PLACEHOLDER("thi-van-tam"),
    biography: bio("Thi Văn Tám"),
    tier: "bottom",
    sortOrder: 5,
    timeline: [timeline("2006", "Thứ trưởng Bộ Công an")],
  },
  {
    id: "pham-dung",
    name: "Phạm Dũng",
    position:
      "TC trưởng TC ANND (2008-2009)\nTC trưởng TC An ninh II (2010)\nThứ trưởng Bộ NV kiêm Trưởng Ban TGCP (2012)\nThứ trưởng Bộ CA (2015-2017)",
    portraitUrl: PLACEHOLDER("pham-dung"),
    biography: bio("Phạm Dũng"),
    tier: "bottom",
    sortOrder: 6,
    timeline: [timeline("2015", "Thứ trưởng Bộ Công an")],
  },
  {
    id: "pham-the-tung",
    name: "Phạm Thế Tùng",
    position:
      "Cục trưởng Cục ANCT nội bộ (12/2023)\nThứ trưởng Bộ CA (7/2024)",
    portraitUrl: PLACEHOLDER("pham-the-tung"),
    biography: bio("Phạm Thế Tùng"),
    tier: "bottom",
    sortOrder: 7,
    timeline: [timeline("2024", "Thứ trưởng Bộ Công an")],
  },
];
