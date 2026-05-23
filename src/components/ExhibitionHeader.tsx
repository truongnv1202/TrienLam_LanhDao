import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <>
      <header className="exhibition-header">
        <Image
          src="/images/header-decoration.png"
          alt=""
          width={766}
          height={422}
          className="exhibition-header-decoration"
          priority
        />
        <div className="exhibition-header-titles">
          <p className="exhibition-title-sub">VAI TRÒ, UY TÍN</p>
          <h1 className="exhibition-title-main">LÃNH ĐẠO AN NINH NHÂN DÂN</h1>
        </div>
      </header>
    </>
  );
}
