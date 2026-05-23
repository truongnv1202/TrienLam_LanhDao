"use client";

import { useLayoutEffect, useState } from "react";

interface ExhibitionCanvasProps {
  children: React.ReactNode;
}

/** Scale khối 1920×1080 để khớp tỷ lệ ảnh mẫu trên mọi màn hình */
export default function ExhibitionCanvas({ children }: ExhibitionCanvasProps) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      const viewport = window.visualViewport;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      const nextScale = Math.min(width / 1920, height / 1080);
      setScale(Number(nextScale.toFixed(4)));
    };

    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="exhibition-viewport">
      <div
        className="exhibition-canvas"
        style={{
          "--canvas-scale": scale,
          transform: `scale(${scale})`,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
