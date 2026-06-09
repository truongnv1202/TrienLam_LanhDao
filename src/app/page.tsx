"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LeaderCard from "@/components/LeaderCard";
import LeaderModal from "@/components/LeaderModal";
import HomeExhibitionBackground from "@/components/HomeExhibitionBackground";
import ExhibitionHeader from "@/components/ExhibitionHeader";
import ExhibitionCanvas from "@/components/ExhibitionCanvas";
import {
  getDefaultDisplayConfig,
  isVisibleDisplaySection,
  type VisibleLeaderDisplaySection,
} from "@/lib/display-layout";
import type { Leader } from "@/types";

function getDisplayConfig(leader: Leader):
  | { section: VisibleLeaderDisplaySection; order: number }
  | undefined {
  if (leader.displaySection === "hidden") return undefined;
  if (isVisibleDisplaySection(leader.displaySection)) {
    return {
      section: leader.displaySection,
      order: leader.displayOrder ?? leader.sortOrder ?? 999,
    };
  }
  return getDefaultDisplayConfig(leader);
}

function getSectionLeaders(
  leaders: Leader[],
  section: VisibleLeaderDisplaySection
): Leader[] {
  return leaders
    .map((leader, index) => ({ leader, index, config: getDisplayConfig(leader) }))
    .filter((item) => item.config?.section === section)
    .sort((a, b) => {
      const orderA = a.config?.order ?? 999;
      const orderB = b.config?.order ?? 999;
      return orderA - orderB || a.index - b.index;
    })
    .map(({ leader }) => leader);
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

  const partyLeaders = getSectionLeaders(leaders, "party");
  const ministerLeaders = getSectionLeaders(leaders, "minister");
  const deputyRows = [
    getSectionLeaders(leaders, "deputy-1"),
    getSectionLeaders(leaders, "deputy-2"),
  ];

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
