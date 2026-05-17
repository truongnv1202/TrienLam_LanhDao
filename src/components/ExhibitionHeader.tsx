import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <header className="exhibition-header">
      <Image
        src="/images/emblem-annd.png"
        alt="Huy hiệu Công an nhân dân"
        width={144}
        height={113}
        className="exhibition-emblem"
        priority
      />
      <div className="exhibition-header-titles">
        <p className="exhibition-title-sub">VAI TRÒ, UY TÍN</p>
        <h1 className="exhibition-title-main">LÃNH ĐẠO AN NINH NHÂN DÂN</h1>
      </div>
    </header>
  );
}
