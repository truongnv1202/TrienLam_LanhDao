"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import LeaderCard from "@/components/LeaderCard";
import LeaderModal from "@/components/LeaderModal";
import HomeExhibitionBackground from "@/components/HomeExhibitionBackground";
import ExhibitionHeader from "@/components/ExhibitionHeader";
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

  const topTier = leaders.filter((l) => l.tier === "top");
  const bottomTier = leaders.filter((l) => l.tier === "bottom");

  return (
    <div className="exhibition-page relative min-h-screen min-h-[100dvh] overflow-x-hidden">
      <HomeExhibitionBackground />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[96rem] flex-col px-2 py-3 sm:px-4 sm:py-4">
        <ExhibitionHeader />

        {loading && (
          <div className="flex flex-1 items-center justify-center py-16">
            <Loader2
              className="h-10 w-10 animate-spin text-[#f5d76e]"
              aria-label="Đang tải"
            />
          </div>
        )}

        {error && (
          <p className="mx-auto max-w-lg rounded border border-red-400/40 bg-red-950/50 px-4 py-3 text-center text-sm text-red-100">
            {error}
          </p>
        )}

        {!loading && !error && (
          <main className="flex flex-1 flex-col items-center justify-center gap-4 pb-4 pt-1 sm:gap-5 md:gap-6">
            {topTier.length > 0 && (
              <section
                aria-label="Hàng lãnh đạo trên"
                className="exhibition-row-top grid w-full justify-items-center gap-2 sm:gap-3"
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
                className="exhibition-row-bottom grid w-full justify-items-center gap-1.5 sm:gap-2.5"
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

            {leaders.length === 0 && (
              <p className="text-center text-sm text-white/75">
                Chưa có dữ liệu lãnh đạo.
              </p>
            )}
          </main>
        )}
      </div>

      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
}
