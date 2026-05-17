function GoldStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
      fill="currentColor"
    >
      <polygon points="50,4 61,38 98,38 68,60 79,95 50,74 21,95 32,60 2,38 39,38" />
    </svg>
  );
}

function EmblemMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 88" className={className} aria-hidden>
      <circle cx="44" cy="44" r="42" fill="#1a5c2e" stroke="#d4af37" strokeWidth="2" />
      <circle cx="44" cy="44" r="34" fill="none" stroke="#d4af37" strokeWidth="1.5" />
      <polygon
        points="44,18 48,32 63,32 51,41 55,56 44,47 33,56 37,41 25,32 40,32"
        fill="#f0c830"
      />
      <text
        x="44"
        y="68"
        textAnchor="middle"
        fill="#f5d76e"
        fontSize="7"
        fontWeight="700"
        fontFamily="serif"
      >
        ANND
      </text>
    </svg>
  );
}

export default function ExhibitionHeader() {
  return (
    <header className="exhibition-header relative z-10 shrink-0">
      <EmblemMark className="exhibition-emblem absolute left-0 top-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]" />
      <GoldStar className="exhibition-star absolute right-0 top-0 text-[#f0c830] drop-shadow-[0_0_18px_rgba(240,200,48,0.55)]" />

      <div className="exhibition-header-titles text-center">
        <p className="exhibition-title-sub font-serif font-semibold tracking-[0.14em] text-[#e8c547]">
          VAI TRÒ, UY TÍN
        </p>
        <h1 className="exhibition-title-main mt-0.5 font-serif font-bold leading-[1.1] tracking-[0.05em] text-[#f5d76e]">
          LÃNH ĐẠO AN NINH NHÂN DÂN
        </h1>
      </div>
    </header>
  );
}
