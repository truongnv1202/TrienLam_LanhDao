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
    <header className="relative z-10 mb-2 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 px-1 sm:gap-4 sm:px-4">
      <div className="flex justify-start pt-1">
        <EmblemMark className="h-14 w-14 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:h-[5.5rem] sm:w-[5.5rem]" />
      </div>

      <div className="px-1 pt-1 text-center sm:pt-2">
        <p className="exhibition-title-sub font-serif text-lg font-semibold tracking-[0.12em] text-[#e8c547] sm:text-2xl md:text-[1.75rem]">
          VAI TRÒ, UY TÍN
        </p>
        <h1 className="exhibition-title-main mt-0.5 font-serif text-xl font-bold leading-tight tracking-[0.06em] text-[#f5d76e] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-3xl md:text-4xl lg:text-[2.65rem]">
          LÃNH ĐẠO AN NINH NHÂN DÂN
        </h1>
      </div>

      <div className="flex justify-end pt-0 sm:pt-1">
        <GoldStar className="h-16 w-16 text-[#f0c830] drop-shadow-[0_0_18px_rgba(240,200,48,0.55)] sm:h-24 sm:w-24 md:h-28 md:w-28" />
      </div>
    </header>
  );
}
