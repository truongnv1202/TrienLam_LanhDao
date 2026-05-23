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
        "hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]/80",
        isTopTier ? "exhibition-card-top" : "exhibition-card-bottom",
      ].join(" ")}
      aria-label={`Xem tiểu sử đồng chí ${leader.name}`}
    >
      <div className="leader-portrait-frame relative w-full shrink-0 overflow-hidden">
        <Image
          src={leader.portraitUrl}
          alt=""
          fill
          sizes="162px"
          className="leader-portrait-image"
          priority={isTopTier}
        />
      </div>

      <div className="exhibition-leader-info flex w-full shrink-0 flex-col items-center justify-center">
        <p className="exhibition-label">ĐỒNG CHÍ</p>
        <h3 className="exhibition-name">{leader.name}</h3>
      </div>

      <span className="leader-card-overlay" aria-hidden>
        <Image
          src="/images/group-37593-overlay.png"
          alt=""
          fill
          sizes="162px"
          className="leader-card-overlay-image"
        />
      </span>
    </button>
  );
}
