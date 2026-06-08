import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <>
      <div className="exhibition-header-flag-layer" aria-hidden>
        <Image
          src="/images/vietnam-flag-transparent-20260604-1902.png"
          alt=""
          width={1532}
          height={844}
          sizes="100vw"
          className="exhibition-header-flag"
          priority
        />
      </div>

      <div className="exhibition-header-art-layer" aria-hidden>
        <Image
          src="/images/police-badge-transparent-20260604-1851.png"
          alt=""
          width={302}
          height={238}
          sizes="100vw"
          className="exhibition-header-art"
          priority
        />
      </div>

      <header className="exhibition-header">
        <div className="exhibition-header-titles">
          <h1 className="exhibition-title-text">
            <Image
              src="/images/exhibition-title-transparent-20260608-2036.png"
              alt="Từ lãnh đạo Cục Lực lượng An ninh nhân dân đến những cương vị lãnh đạo Đảng, Nhà nước và Bộ Công an"
              width={1024}
              height={72}
              unoptimized
              className="exhibition-title-image"
              priority
            />
          </h1>
        </div>
      </header>
    </>
  );
}
