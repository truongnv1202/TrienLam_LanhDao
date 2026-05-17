"use client";

import { useCallback, useEffect, useState } from "react";
import { Award, Loader2 } from "lucide-react";
import LeaderCard from "@/components/LeaderCard";
import LeaderModal from "@/components/LeaderModal";
import HomeVideoBackground from "@/components/HomeVideoBackground";
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
    <div className="relative min-h-screen overflow-hidden">
      <HomeVideoBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#800000]/80 shadow-[0_0_24px_rgba(212,175,55,0.35)]">
            <Award className="h-9 w-9 text-[#ffdf7a]" aria-hidden />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-[#ffdf7a] sm:text-3xl md:text-4xl">
            Sơ đồ tổ chức
          </h1>
          <p className="mt-2 text-sm text-white/80 sm:text-base">
            Lãnh đạo lực lượng An ninh nhân dân
          </p>
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
        </header>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2
              className="h-10 w-10 animate-spin text-[#ffdf7a]"
              aria-label="Đang tải"
            />
          </div>
        )}

        {error && (
          <p className="rounded-lg border border-red-400/50 bg-red-900/30 px-4 py-3 text-center text-sm text-red-100">
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="flex flex-col items-center gap-12">
            {topTier.length > 0 && (
              <section aria-label="Cấp lãnh đạo cao">
                <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.35em] text-[#d4af37]/90">
                  Cấp lãnh đạo chủ chốt
                </h2>
                <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-8 md:gap-10">
                  {topTier.map((leader) => (
                    <LeaderCard
                      key={leader.id}
                      leader={leader}
                      onClick={setSelectedLeader}
                    />
                  ))}
                </div>
              </section>
            )}

            {topTier.length > 0 && bottomTier.length > 0 && (
              <div className="flex w-full max-w-md items-center gap-3 px-4">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#d4af37]/60" />
                <span className="text-[10px] uppercase tracking-widest text-[#d4af37]/70">
                  Ban lãnh đạo
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#d4af37]/60" />
              </div>
            )}

            {bottomTier.length > 0 && (
              <section aria-label="Cấp lãnh đạo">
                <h2 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.35em] text-[#d4af37]/70">
                  Cấp phó lãnh đạo
                </h2>
                <div className="flex flex-wrap items-end justify-center gap-5 sm:gap-7 md:gap-9">
                  {bottomTier.map((leader) => (
                    <LeaderCard
                      key={leader.id}
                      leader={leader}
                      onClick={setSelectedLeader}
                    />
                  ))}
                </div>
              </section>
            )}

            {leaders.length === 0 && (
              <p className="text-center text-white/70">Chưa có dữ liệu lãnh đạo.</p>
            )}
          </div>
        )}
      </div>

      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
}
