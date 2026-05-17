"use client";

import { useEffect, useState } from "react";

interface ExhibitionCanvasProps {
  children: React.ReactNode;
}

/** Scale khối 1920×1080 để khớp tỷ lệ ảnh mẫu trên mọi màn hình */
export default function ExhibitionCanvas({ children }: ExhibitionCanvasProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const sw = window.innerWidth / 1920;
      const sh = window.innerHeight / 1080;
      setScale(Math.min(sw, sh));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div className="exhibition-viewport">
      <div
        className="exhibition-canvas"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}
