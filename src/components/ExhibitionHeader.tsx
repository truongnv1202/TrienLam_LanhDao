import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <header className="exhibition-header relative z-10 w-full shrink-0">
      <Image
        src="/images/emblem-annd.png"
        alt="Huy hiệu Công an nhân dân"
        width={128}
        height={128}
        className="exhibition-emblem object-contain"
        priority
      />
      <Image
        src="/images/flag-vn.png"
        alt="Cờ Tổ quốc"
        width={150}
        height={150}
        className="exhibition-flag object-contain"
        priority
      />

      <div className="exhibition-header-titles">
        <p className="exhibition-title-sub">VAI TRÒ, UY TÍN</p>
        <h1 className="exhibition-title-main">LÃNH ĐẠO AN NINH NHÂN DÂN</h1>
      </div>
    </header>
  );
}
