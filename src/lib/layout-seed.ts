import type { Leader } from "@/types";
import { DEPUTY_TAB_LEADER_IDS, LEADER_NAME_BY_ID } from "@/lib/display-layout";

const EXTRA_DEPUTY_LEADER_IDS = [
  "pham-trong-tue",
  "ngo-ngoc-du",
  "dang-ky",
  "nguyen-quang-viet",
  "nguyen-minh-tien",
  "tran-dong",
  "nguyen-van-duc",
  "lam-van-the",
  "pham-tam-long",
  "vu-thai-hoa",
  "nguyen-tan-dung",
  "le-the-tiem",
  "nguyen-van-tinh",
  "nguyen-van-ro",
  "dang-van-hieu",
  "le-quy-vuong",
  "pham-quy-ngo",
  "bui-quang-ben",
  "nguyen-van-thanh",
  "nguyen-van-son",
  "nguyen-ngoc-duy",
  "le-quoc-hung",
  "le-tan-toi",
  "tran-quoc-to",
  "le-van-tuyen",
  "nguyen-van-long",
  "nguyen-ngoc-lam",
  "dang-hong-duc",
];

function makeDeputySeedLeader(id: string): Leader {
  const order = DEPUTY_TAB_LEADER_IDS.indexOf(id) + 1;
  const portraitUrl = `/uploads/portraits/${id}.jpg`;
  const name = LEADER_NAME_BY_ID[id] ?? id;

  return {
    id,
    name,
    position: "Thứ trưởng Bộ Công an",
    portraitUrl,
    homePortraitUrl: portraitUrl,
    detailPortraitUrl: portraitUrl,
    biography: `Thông tin tiểu sử đồng chí ${name} đang được cập nhật.`,
    tier: "bottom",
    sortOrder: order,
    displaySection: order <= 22 ? "deputy-1" : "deputy-2",
    displayOrder: order,
    timeline: [
      {
        year: "",
        event: "Thứ trưởng Bộ Công an",
        description: "Thứ trưởng Bộ Công an",
        sort: 1,
      },
    ],
    awards: [],
  };
}

export const LAYOUT_SEED_LEADERS: Leader[] = EXTRA_DEPUTY_LEADER_IDS.map(
  makeDeputySeedLeader
);
