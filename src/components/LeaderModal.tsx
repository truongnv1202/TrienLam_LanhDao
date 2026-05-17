"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Calendar } from "lucide-react";
import type { Leader } from "@/types";

interface LeaderModalProps {
  leader: Leader | null;
  onClose: () => void;
}

export default function LeaderModal({ leader, onClose }: LeaderModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!leader) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [leader, handleKeyDown]);

  if (!leader) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leader-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="Đóng hộp thoại"
      />

      <div className="modal-animate gold-glow relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#d4af37]/50 bg-gradient-to-br from-[#6b0000] via-[#800000] to-[#4a0000] shadow-2xl lg:max-h-[88vh] lg:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full border border-[#d4af37]/50 bg-[#4a0000]/80 p-2 text-[#ffdf7a] transition hover:bg-[#800000] hover:text-white"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tiểu sử — bên trái */}
        <section className="flex flex-1 flex-col gap-4 overflow-y-auto border-b border-[#d4af37]/25 p-5 sm:p-6 lg:max-w-[55%] lg:border-b-0 lg:border-r">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="leader-portrait-frame relative h-40 w-32 shrink-0 overflow-hidden rounded-lg border-2 border-[#d4af37]/60 shadow-lg sm:h-48 sm:w-36">
              <Image
                src={leader.portraitUrl}
                alt={leader.name}
                fill
                className="relative z-[1] object-contain object-bottom drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                sizes="144px"
              />
            </div>
            <div>
              <h2
                id="leader-modal-title"
                className="text-xl font-bold text-[#ffdf7a] sm:text-2xl"
              >
                {leader.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#d4af37] sm:text-base">
                {leader.position}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ffdf7a]/90">
              Tiểu sử tóm tắt
            </h3>
            <p className="text-sm leading-relaxed text-white/90 sm:text-base">
              {leader.biography}
            </p>
          </div>
        </section>

        {/* Timeline dọc — bên phải */}
        <section className="flex min-h-[240px] flex-1 flex-col lg:max-w-[45%]">
          <h3 className="border-b border-[#d4af37]/25 px-5 py-3 text-sm font-semibold uppercase tracking-wider text-[#ffdf7a]">
            Dòng thời gian sự nghiệp
          </h3>
          <div className="timeline-track relative flex-1 overflow-y-auto px-5 py-4 sm:px-6">
            <ol className="relative space-y-6 pl-8">
              <span
                className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-gradient-to-b from-[#d4af37]/70 via-[#ffdf7a]/40 to-[#d4af37]/20"
                aria-hidden
              />
              {leader.timeline.map((item, index) => (
                <li key={`${item.year}-${item.event}-${index}`} className="relative">
                  <span
                    className="absolute -left-8 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#800000] shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                    aria-hidden
                  >
                    <Calendar className="h-3 w-3 text-[#ffdf7a]" />
                  </span>
                  <article
                    className="group rounded-lg border border-[#d4af37]/20 bg-[#5c0000]/50 p-3 transition-all duration-300 hover:border-[#ffdf7a]/70 hover:bg-[#6b0000]/80 hover:shadow-[0_0_20px_rgba(255,223,122,0.35)]"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-[#ffdf7a] transition group-hover:text-white">
                      {item.year}
                    </p>
                    <h4 className="mt-1 text-sm font-semibold text-[#d4af37] transition group-hover:text-[#ffdf7a]">
                      {item.event}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/80 sm:text-sm">
                      {item.description}
                    </p>
                  </article>
                </li>
              ))}
            </ol>
            {leader.timeline.length === 0 && (
              <p className="text-center text-sm text-white/60">
                Chưa có mốc thời gian nào.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
