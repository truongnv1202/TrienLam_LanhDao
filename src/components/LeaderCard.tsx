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
        "exhibition-leader-card group flex flex-col overflow-hidden text-left transition-transform duration-200",
        "hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d76e]/80",
        isTopTier ? "exhibition-card-top" : "exhibition-card-bottom",
      ].join(" ")}
      aria-label={`Xem tiểu sử đồng chí ${leader.name}`}
    >
      <div
        className={[
          "leader-portrait-frame relative w-full overflow-hidden",
          isTopTier ? "exhibition-portrait-top" : "exhibition-portrait-bottom",
        ].join(" ")}
      >
        <Image
          src={leader.portraitUrl}
          alt=""
          fill
          sizes={isTopTier ? "152px" : "130px"}
          className="relative z-[1] object-contain object-bottom"
          priority={isTopTier}
        />
      </div>

      <div className="exhibition-leader-info flex flex-col items-center justify-center px-1.5 py-1.5 text-center">
        <p className="text-[8px] font-medium leading-none text-[#e8c547] sm:text-[9px]">
          Đồng chí
        </p>
        <h3
          className={[
            "mt-0.5 font-bold leading-tight text-[#f5d76e]",
            isTopTier ? "text-[11px] sm:text-xs" : "text-[10px] sm:text-[11px]",
          ].join(" ")}
        >
          {leader.name}
        </h3>
        <p className="exhibition-position mt-0.5 text-[7px] leading-[1.25] text-white/92 sm:text-[8px]">
          {leader.position}
        </p>
      </div>
    </button>
  );
}
