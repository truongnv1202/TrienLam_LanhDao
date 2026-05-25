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
          <Image
            src="/images/home-title.png"
            alt="Vai trò, uy tín - Lãnh đạo An ninh nhân dân"
            width={1024}
            height={128}
            className="exhibition-title-image"
            priority
          />
        </div>
      </header>
    </>
  );
}
