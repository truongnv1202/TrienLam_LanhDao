import Image from "next/image";

/** Cờ VN — lớp nền, nằm dưới các thẻ lãnh đạo */
export default function ExhibitionFlag() {
  return (
    <div className="exhibition-flag-wrap" aria-hidden>
      <Image
        src="/images/flag-vn.png"
        alt=""
        width={361}
        height={260}
        className="exhibition-flag"
        priority
      />
    </div>
  );
}
