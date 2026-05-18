"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Calendar } from "lucide-react";
import { formatPositionNewestFirst } from "@/lib/format-position";
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

      <div className="modal-animate gold-glow relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#d4af37]/50 bg-gradient-to-b from-[#6b0000] via-[#800000] to-[#4a0000] shadow-2xl sm:max-w-3xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full border border-[#d4af37]/50 bg-[#4a0000]/80 p-2 text-[#ffdf7a] transition hover:bg-[#800000] hover:text-white"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="leader-modal-scroll flex min-h-0 flex-1 flex-col overflow-y-auto">
          {/* Ảnh chân dung — to, phía trên */}
          <div className="leader-modal-portrait relative mx-auto w-full shrink-0">
            <Image
              src={leader.portraitUrl}
              alt={leader.name}
              fill
              className="leader-modal-portrait-image"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>

          {/* Đồng chí → tên → chức vụ */}
          <header className="shrink-0 border-b border-[#d4af37]/25 px-5 py-4 text-center sm:px-8 sm:py-5">
            <p className="text-base font-normal text-[#ffd700] sm:text-lg">
              Đồng chí
            </p>
            <h2
              id="leader-modal-title"
              className="mt-1 text-2xl font-bold text-[#ffd700] sm:text-3xl"
            >
              {leader.name}
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#fff8e7] sm:text-base">
              {formatPositionNewestFirst(leader.position)}
            </p>
          </header>

          {/* Tiểu sử */}
          <section className="shrink-0 px-5 py-4 sm:px-8 sm:py-5">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#ffdf7a]/90">
              Tiểu sử
            </h3>
            <p className="text-sm leading-relaxed text-white/90 sm:text-base">
              {leader.biography}
            </p>
          </section>

          {leader.timeline.length > 0 && (
            <section className="shrink-0 border-t border-[#d4af37]/25 px-5 py-4 sm:px-8 sm:py-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#ffdf7a]">
              Dòng thời gian sự nghiệp
            </h3>
            <div className="timeline-track relative pl-1">
              <ol className="relative space-y-5 pl-8">
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
                    <article className="group rounded-lg border border-[#d4af37]/20 bg-[#5c0000]/50 p-3 transition-all duration-300 hover:border-[#ffdf7a]/70 hover:bg-[#6b0000]/80 hover:shadow-[0_0_20px_rgba(255,223,122,0.35)]">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#ffdf7a]">
                        {item.year}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-[#d4af37] group-hover:text-[#ffdf7a]">
                        {item.event}
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-white/80 sm:text-sm">
                        {item.description}
                      </p>
                    </article>
                  </li>
                ))}
              </ol>
            </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
