"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Leader } from "@/types";

interface LeaderCardProps {
  leader: Leader;
  onClick: (leader: Leader) => void;
}

export default function LeaderCard({ leader, onClick }: LeaderCardProps) {
  const isTopTier = leader.tier === "top";

  return (
    <button
      type="button"
      onClick={() => onClick(leader)}
      className={[
        "group relative flex w-full flex-col overflow-hidden rounded-xl border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#8b0000]/90 to-[#5c0000]/95 text-left shadow-lg transition-all duration-300 ease-out",
        "hover:scale-105 hover:border-[#ffdf7a] hover:shadow-[0_0_28px_rgba(255,223,122,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffdf7a]",
        isTopTier ? "max-w-[242px] sm:max-w-[264px]" : "max-w-[220px] sm:max-w-[240px]",
      ].join(" ")}
      aria-label={`Xem tiểu sử ${leader.name}`}
    >
      <div className="absolute right-2 top-2 z-10 rounded-full bg-[#d4af37]/20 p-1 opacity-80 transition group-hover:opacity-100">
        <Star className="h-4 w-4 fill-[#ffdf7a] text-[#ffdf7a]" aria-hidden />
      </div>

      <div className="leader-portrait-frame relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={leader.portraitUrl}
          alt={`Ảnh chân dung ${leader.name}`}
          fill
          sizes="(max-width: 640px) 220px, 264px"
          className="relative z-[1] object-contain object-bottom drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition-all duration-300 group-hover:brightness-110 group-hover:drop-shadow-[0_6px_16px_rgba(212,175,55,0.35)]"
          priority={isTopTier}
        />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#4a0000]/50 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-1.5 px-4 py-3">
        <h3
          className={[
            "font-bold leading-tight text-[#ffdf7a]",
            isTopTier ? "text-base sm:text-lg" : "text-sm sm:text-base",
          ].join(" ")}
        >
          {leader.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-snug text-white/85 sm:text-sm">
          {leader.position}
        </p>
        <span className="mt-1 text-[10px] uppercase tracking-widest text-[#d4af37]/80">
          Nhấn để xem tiểu sử
        </span>
      </div>
    </button>
  );
}
