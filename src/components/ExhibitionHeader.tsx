import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <>
      <div className="exhibition-header-art-layer" aria-hidden>
        <Image
          src="/images/header-decor.png"
          alt=""
          fill
          sizes="100vw"
          className="exhibition-header-art"
          priority
        />
      </div>

      <header className="exhibition-header">
        <div className="exhibition-header-titles">
          <h1 className="exhibition-title-text">
            TỪ LỰC LƯỢNG AN NINH NHÂN DÂN ĐẾN NHỮNG CƯƠNG VỊ LÃNH ĐẠO CHỦ CHỐT
          </h1>
        </div>
      </header>
    </>
  );
}
