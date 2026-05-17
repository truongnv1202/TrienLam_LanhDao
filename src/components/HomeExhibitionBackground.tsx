"use client";

import { useEffect, useRef } from "react";

/** Video nền 16:9 — đặt file tại public/videos/exhibition-background.mp4 */
const VIDEO_PRIMARY = "/videos/exhibition-background.mp4";
const VIDEO_FALLBACK = "/videos/home-background.mp4";

export default function HomeExhibitionBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {
        /* Trình duyệt có thể chặn autoplay */
      });
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#4a0c0c]"
      aria-hidden
    >
      <video
        ref={videoRef}
        className="exhibition-video-bg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={VIDEO_PRIMARY} type="video/mp4" />
        <source src={VIDEO_FALLBACK} type="video/mp4" />
      </video>
      <div className="exhibition-video-overlay absolute inset-0" />
    </div>
  );
}
