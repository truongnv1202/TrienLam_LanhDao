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
      <div
        className={[
          "leader-portrait-frame relative w-full shrink-0 overflow-hidden",
          isTopTier ? "exhibition-portrait-top" : "exhibition-portrait-bottom",
        ].join(" ")}
      >
        <Image
          src={leader.portraitUrl}
          alt=""
          fill
          sizes={isTopTier ? "(min-width:1200px) 142px, 120px" : "(min-width:1200px) 122px, 104px"}
          className="relative z-[1] object-contain object-bottom"
          priority={isTopTier}
        />
      </div>

      <div className="exhibition-leader-info flex min-h-0 flex-1 flex-col items-center justify-start px-1 py-1.5">
        <p className="exhibition-label">Đồng chí</p>
        <h3 className="exhibition-name">{leader.name}</h3>
        <p className="exhibition-position">{leader.position}</p>
      </div>
    </button>
  );
}
