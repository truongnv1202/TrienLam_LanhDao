"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { Award, X } from "lucide-react";
import { formatPositionNewestFirst } from "@/lib/format-position";
import type { Leader, TimelineEvent } from "@/types";

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

  const workEvents = buildWorkEvents(leader);
  const awards = buildAwards();

  return (
    <div
      className="leader-detail-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leader-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-label="Đóng hộp thoại"
      />

      <div className="leader-detail-shell modal-animate relative z-10">
        <div className="leader-detail-panel">
          <aside className="leader-detail-profile">
            <div className="leader-detail-portrait">
              <Image
                src={leader.portraitUrl}
                alt={leader.name}
                fill
                className="leader-detail-portrait-image"
                sizes="260px"
                priority
              />
            </div>

            <div className="leader-detail-profile-info">
              <p className="leader-detail-label">Đồng chí</p>
              <h2 id="leader-modal-title" className="leader-detail-name">
                {leader.name}
              </h2>
              <div className="leader-detail-divider" aria-hidden>
                <span />
              </div>
              <p className="leader-detail-meta">
                {formatPositionNewestFirst(leader.position)}
              </p>
            </div>
          </aside>

          <section className="leader-detail-work">
            <SectionBadge>QUÁ TRÌNH CÔNG TÁC</SectionBadge>
            <div className="leader-detail-timeline leader-modal-scroll">
              {workEvents.map((item, index) => (
                <article
                  className="leader-detail-timeline-item"
                  key={`${item.year}-${item.event}-${index}`}
                >
                  <time>{item.year}</time>
                  <span aria-hidden />
                  <p>{item.event}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="leader-detail-awards">
            <SectionBadge>PHẦN THƯỞNG CAO QUÝ</SectionBadge>
            <ul className="leader-detail-awards-list leader-modal-scroll">
              {awards.map((award) => (
                <li key={award}>
                  <span className="leader-detail-award-icon" aria-hidden>
                    <Award className="h-5 w-5" />
                  </span>
                  <span>{award}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="leader-detail-close"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="leader-detail-section-badge">
      <span aria-hidden>❦</span>
      {children}
      <span aria-hidden>❦</span>
    </h3>
  );
}

function buildWorkEvents(leader: Leader): TimelineEvent[] {
  if (leader.timeline.length > 0) return leader.timeline;

  return formatPositionNewestFirst(leader.position)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      year: extractYearLabel(line),
      event: line,
      description: line,
    }));
}

function extractYearLabel(text: string): string {
  const monthYear = text.match(/\b\d{1,2}\/\d{4}\b/);
  if (monthYear) return monthYear[0];

  const range = text.match(/\b\d{4}\s*[-–]\s*(?:\d{4}|Nay)\b/i);
  if (range) return range[0].replace(/\s+/g, "");

  const year = text.match(/\b\d{4}\b/);
  return year?.[0] ?? "";
}

function buildAwards(): string[] {
  return [
    "Huân chương chiến công hạng Nhất",
    "Huân chương chiến công hạng Ba",
    "02 Bằng khen của Thủ tướng Chính phủ",
    "Nhiều phần thưởng cao quý khác",
  ];
}
