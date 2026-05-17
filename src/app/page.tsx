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
      const response = await fetch("/api/leaders");
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

  const byOrder = (a: Leader, b: Leader) =>
    (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

  const topTier = leaders
    .filter((l) => l.tier === "top")
    .sort(byOrder);
  const bottomTier = leaders
    .filter((l) => l.tier === "bottom")
    .sort(byOrder);

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
                <section
                  aria-label="Hàng lãnh đạo trên"
                  className="exhibition-row exhibition-row-top"
                >
                  {topTier.map((leader) => (
                    <LeaderCard
                      key={leader.id}
                      leader={leader}
                      onClick={setSelectedLeader}
                    />
                  ))}
                </section>
              )}

              {bottomTier.length > 0 && (
                <section
                  aria-label="Hàng lãnh đạo dưới"
                  className="exhibition-row exhibition-row-bottom"
                >
                  {bottomTier.map((leader) => (
                    <LeaderCard
                      key={leader.id}
                      leader={leader}
                      onClick={setSelectedLeader}
                    />
                  ))}
                </section>
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
