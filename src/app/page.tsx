"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LeaderCard from "@/components/LeaderCard";
import LeaderModal from "@/components/LeaderModal";
import HomeExhibitionBackground from "@/components/HomeExhibitionBackground";
import ExhibitionHeader from "@/components/ExhibitionHeader";
import ExhibitionCanvas from "@/components/ExhibitionCanvas";
import type { Leader } from "@/types";

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
    "tran-quyet",
    "vien-chi",
    "hoang-thao",
    "cao-dang-chiem",
    "nguyen-tai",
    "nguyen-minh-tien",
  ],
  [
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

function pickLeadersById(leaders: Leader[], ids: string[]): Leader[] {
  const byId = new Map(leaders.map((leader) => [leader.id, leader]));
  return ids.flatMap((id) => {
    const leader = byId.get(id);
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
                  <div
                    className="exhibition-group-label exhibition-group-label-party"
                    aria-label="Lãnh đạo Đảng, Nhà nước"
                  />
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
                  <div
                    className="exhibition-group-label exhibition-group-label-minister"
                    aria-label="Bộ trưởng"
                  >
                    Bộ trưởng
                  </div>
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
                  <div
                    className="exhibition-group-label exhibition-group-label-deputy"
                    aria-label="Thứ trưởng"
                  >
                    Thứ trưởng
                  </div>
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
