"use client";

import Image from "next/image";
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
        "exhibition-leader-card group flex w-full flex-col overflow-hidden text-left transition-transform duration-200",
        "hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d76e]/80",
        isTopTier ? "max-w-[13.25rem]" : "max-w-[11.75rem]",
      ].join(" ")}
      aria-label={`Xem tiểu sử đồng chí ${leader.name}`}
    >
      <div className="leader-portrait-frame relative aspect-[3/4] w-full overflow-hidden">
        <Image
          src={leader.portraitUrl}
          alt=""
          fill
          sizes={isTopTier ? "212px" : "188px"}
          className="relative z-[1] object-contain object-bottom"
          priority={isTopTier}
        />
      </div>

      <div className="exhibition-leader-info flex flex-col items-center px-2 py-2 text-center sm:px-2.5 sm:py-2.5">
        <p className="text-[9px] font-medium tracking-wide text-[#e8c547] sm:text-[10px]">
          Đồng chí
        </p>
        <h3
          className={[
            "mt-0.5 font-bold leading-tight text-[#f5d76e]",
            isTopTier ? "text-sm sm:text-base" : "text-xs sm:text-sm",
          ].join(" ")}
        >
          {leader.name}
        </h3>
        <p className="mt-1 line-clamp-4 text-[8px] leading-snug text-white/92 sm:text-[9px]">
          {leader.position}
        </p>
      </div>
    </button>
  );
}
