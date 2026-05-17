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
        "exhibition-leader-card group flex flex-col overflow-hidden text-center transition-transform duration-200",
        "hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d76e]/80",
        isTopTier ? "exhibition-card-top" : "exhibition-card-bottom",
      ].join(" ")}
      aria-label={`Xem tiểu sử đồng chí ${leader.name}`}
    >
      <div className="leader-portrait-frame relative min-h-0 w-full flex-1 overflow-hidden">
        <Image
          src={leader.portraitUrl}
          alt=""
          fill
          sizes={isTopTier ? "286px" : "244px"}
          className="relative z-[1] object-contain object-bottom"
          priority={isTopTier}
        />
      </div>

      <div className="exhibition-leader-info shrink-0">
        <p className="exhibition-label">Đồng chí</p>
        <h3 className="exhibition-name">{leader.name}</h3>
        <p className="exhibition-position">{leader.position}</p>
      </div>
    </button>
  );
}
