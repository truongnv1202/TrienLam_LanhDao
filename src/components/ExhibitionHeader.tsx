import Image from "next/image";

export default function ExhibitionHeader() {
  return (
    <>
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
              src="/images/exhibition-title-transparent-20260604-1723.png"
              alt="Từ lãnh đạo cục thuộc lực lượng An ninh nhân dân đến những cương vị lãnh đạo chủ chốt"
              width={2597}
              height={248}
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
