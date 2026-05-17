"use client";

import { useEffect, useRef } from "react";

const VIDEO_SRC = "/videos/home-background.mp4";

export default function HomeVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const play = () => {
      void video.play().catch(() => {
        /* Trình duyệt có thể chặn autoplay — bỏ qua */
      });
    };

    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <video
        ref={videoRef}
        className="home-video-bg absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>
      {/* Lớp phủ giữ độ tương phản nội dung */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4a0000]/75 via-[#6b0000]/55 to-[#2a0000]/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(74,0,0,0.45)_100%)]" />
    </div>
  );
}
