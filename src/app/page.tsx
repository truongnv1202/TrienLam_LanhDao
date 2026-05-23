"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LeaderCard from "@/components/LeaderCard";
import LeaderModal from "@/components/LeaderModal";
import HomeExhibitionBackground from "@/components/HomeExhibitionBackground";
import ExhibitionHeader from "@/components/ExhibitionHeader";
import ExhibitionCanvas from "@/components/ExhibitionCanvas";
import type { Leader } from "@/types";

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

  const topTier = leaders.filter((l) => l.tier === "top");
  const bottomTier = leaders.filter((l) => l.tier === "bottom");
  const ministryRows = [
    bottomTier.slice(0, 7),
    bottomTier.slice(7, 13),
    bottomTier.slice(13, 20),
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
              {topTier.length > 0 && (
                <>
                  <div className="exhibition-group-label exhibition-group-label-party">
                    LÃNH ĐẠO ĐẢNG, NHÀ NƯỚC
                  </div>
                  <section
                    aria-label="Lãnh đạo Đảng, Nhà nước"
                    className="exhibition-row exhibition-row-top"
                  >
                    {topTier.slice(0, 4).map((leader) => (
                      <LeaderCard
                        key={leader.id}
                        leader={leader}
                        onClick={setSelectedLeader}
                      />
                    ))}
                  </section>
                </>
              )}

              {bottomTier.length > 0 && (
                <>
                  <div className="exhibition-group-label exhibition-group-label-ministry">
                    LÃNH ĐẠO BỘ CÔNG AN
                  </div>
                  {ministryRows.map((row, index) =>
                    row.length > 0 ? (
                      <section
                        key={`ministry-row-${index + 1}`}
                        aria-label={`Lãnh đạo Bộ Công an hàng ${index + 1}`}
                        className={`exhibition-row exhibition-row-ministry exhibition-row-ministry-${index + 1}`}
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
