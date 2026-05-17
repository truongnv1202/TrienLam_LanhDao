import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <header className="exhibition-header">
      <div className="exhibition-header-side exhibition-header-side--left">
        <Image
          src="/images/emblem-annd.png"
          alt="Huy hiệu Công an nhân dân"
          width={108}
          height={108}
          className="exhibition-emblem"
          priority
        />
      </div>

      <div className="exhibition-header-titles">
        <p className="exhibition-title-sub">VAI TRÒ, UY TÍN</p>
        <h1 className="exhibition-title-main">LÃNH ĐẠO AN NINH NHÂN DÂN</h1>
      </div>

      <div className="exhibition-header-side exhibition-header-side--right">
        <Image
          src="/images/flag-vn.png"
          alt="Cờ Tổ quốc"
          width={158}
          height={158}
          className="exhibition-flag"
          priority
        />
      </div>
    </header>
  );
}
