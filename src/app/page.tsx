"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LeaderCard from "@/components/LeaderCard";
import LeaderModal from "@/components/LeaderModal";
import HomeExhibitionBackground from "@/components/HomeExhibitionBackground";
import ExhibitionHeader from "@/components/ExhibitionHeader";
import ExhibitionCanvas from "@/components/ExhibitionCanvas";
import type { Leader } from "@/types";

const LEADER_NAME_BY_ID: Record<string, string> = {
  "tran-quoc-hoan": "Trần Quốc Hoàn",
  "pham-hung": "Phạm Hùng",
  "to-lam": "Tô Lâm",
  "tran-dai-quang": "Trần Đại Quang",
  "pham-minh-chinh": "Phạm Minh Chính",
  "le-gian": "Lê Giản",
  "mai-chi-tho": "Mai Chí Thọ",
  "bui-thien-ngo": "Bùi Thiện Ngộ",
  "le-minh-huong": "Lê Minh Hương",
  "le-hong-anh": "Lê Hồng Anh",
  "luong-tam-quang": "Lương Tam Quang",
  "tran-quoc-huong": "Trần Quốc Hương",
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

const PARTY_LEADER_IDS = [
  "tran-quoc-hoan",
  "pham-hung",
  "to-lam",
  "tran-dai-quang",
  "pham-minh-chinh",
];

const MINISTER_IDS = [
  "le-gian",
  "mai-chi-tho",
  "bui-thien-ngo",
  "le-minh-huong",
  "le-hong-anh",
  "luong-tam-quang",
];

const DEPUTY_ROWS = [
  [
    "tran-quoc-huong",
    "le-quoc-than",
    "ngo-ngoc-du",
    "nguyen-quang-viet",
    "tran-quyet",
    "vien-chi",
    "hoang-thao",
    "cao-dang-chiem",
    "nguyen-tai",
    "nguyen-minh-tien",
  ],
  [
    "lam-van-ta",
    "vo-viet-thanh",
    "nguyen-khanh-toan",
    "nguyen-van-huong",
    "thi-van-tam",
    "bui-van-nam",
    "pham-dung",
    "pham-the-tung",
    "dang-hong-duc",
  ],
];

function normalizeLeaderName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
}

function pickLeadersById(leaders: Leader[], ids: string[]): Leader[] {
  const byId = new Map(leaders.map((leader) => [leader.id, leader]));
  const byName = new Map(
    leaders.map((leader) => [normalizeLeaderName(leader.name), leader])
  );
  return ids.flatMap((id) => {
    const expectedName = LEADER_NAME_BY_ID[id];
    const leader =
      byId.get(id) ||
      (expectedName ? byName.get(normalizeLeaderName(expectedName)) : undefined);
    return leader ? [leader] : [];
  });
}

export default function HomePage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  const fetchLeaders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/leaders", { cache: "no-store" });
      if (!response.ok) throw new Error("Không tải được dữ liệu");
      const data: Leader[] = await response.json();
      setLeaders(data);
    } catch {
      setError("Không thể tải danh sách lãnh đạo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeaders();
  }, [fetchLeaders]);

  const partyLeaders = pickLeadersById(leaders, PARTY_LEADER_IDS);
  const ministerLeaders = pickLeadersById(leaders, MINISTER_IDS);
  const deputyRows = DEPUTY_ROWS.map((row) => pickLeadersById(leaders, row));

  return (
    <div className="exhibition-page relative h-[100dvh] overflow-hidden">
      <HomeExhibitionBackground />

      <ExhibitionCanvas>
        <ExhibitionHeader />

        {loading && (
          <div className="exhibition-loading">
            <Loader2 className="h-12 w-12 animate-spin text-[#f5d76e]" aria-label="Đang tải" />
          </div>
        )}

        {error && (
          <p className="exhibition-error">{error}</p>
        )}

        {!loading && !error && (
          <main className="exhibition-stage">
            <div className="exhibition-board">
              {partyLeaders.length > 0 && (
                <>
                  <section
                    aria-label="Lãnh đạo Đảng, Nhà nước"
                    className="exhibition-row exhibition-row-top"
                  >
                    {partyLeaders.map((leader) => (
                      <LeaderCard
                        key={leader.id}
                        leader={leader}
                        onClick={setSelectedLeader}
                      />
                    ))}
                  </section>
                </>
              )}

              {ministerLeaders.length > 0 && (
                <>
                  <section
                    aria-label="Bộ trưởng"
                    className="exhibition-row exhibition-row-minister"
                  >
                    {ministerLeaders.map((leader) => (
                      <LeaderCard
                        key={leader.id}
                        leader={leader}
                        onClick={setSelectedLeader}
                      />
                    ))}
                  </section>
                </>
              )}

              {deputyRows.some((row) => row.length > 0) && (
                <>
                  {deputyRows.map((row, index) =>
                    row.length > 0 ? (
                      <section
                        key={`deputy-row-${index + 1}`}
                        aria-label={`Thứ trưởng hàng ${index + 1}`}
                        className={`exhibition-row exhibition-row-deputy exhibition-row-deputy-${index + 1}`}
                      >
                        {row.map((leader) => (
                          <LeaderCard
                            key={leader.id}
                            leader={leader}
                            onClick={setSelectedLeader}
                          />
                        ))}
                      </section>
                    ) : null
                  )}
                </>
              )}
            </div>

            {leaders.length === 0 && (
              <p className="text-center text-lg text-white/75">Chưa có dữ liệu lãnh đạo.</p>
            )}
          </main>
        )}
      </ExhibitionCanvas>

      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
}
