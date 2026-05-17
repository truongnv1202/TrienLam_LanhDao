import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <header className="exhibition-header relative z-10 shrink-0">
      <Image
        src="/images/emblem-annd.png"
        alt="Huy hiệu Công an nhân dân"
        width={120}
        height={120}
        className="exhibition-emblem absolute left-0 top-0 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
        priority
      />
      <Image
        src="/images/flag-vn.png"
        alt="Cờ Tổ quốc"
        width={140}
        height={140}
        className="exhibition-flag absolute right-0 top-0 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
        priority
      />

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
