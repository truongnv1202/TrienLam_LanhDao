"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { formatPositionNewestFirst } from "@/lib/format-position";
import { getDetailPortraitUrl } from "@/lib/leader-images";
import type { AwardItem, Leader, TimelineEvent } from "@/types";

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

  const workEvents = sortItemsBySort(buildWorkEvents(leader));
  const awards = sortItemsBySort(normalizeAwards(leader.awards?.length ? leader.awards : buildAwards()));
  const profileMeta = buildProfileMeta(leader.biography);
  const portraitSrc = getDetailPortraitUrl(leader);

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
                src="/images/popup-portrait-bg.png"
                alt=""
                fill
                className="leader-detail-portrait-bg"
                sizes="15.4167vw"
                aria-hidden
                priority
              />
              <Image
                src={portraitSrc}
                alt={leader.name}
                fill
                className="leader-detail-portrait-image"
                sizes="15.4167vw"
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
              {profileMeta && (
                <div className="leader-detail-meta">
                  {profileMeta.birthYear && (
                    <p>
                      <strong>Năm sinh:</strong> {profileMeta.birthYear}
                    </p>
                  )}
                  {profileMeta.hometown && (
                    <p>
                      <strong>Quê quán:</strong> {profileMeta.hometown}
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>

          <section className="leader-detail-work">
            <h3 className="leader-detail-work-heading">
              <Image
                src="/images/work-header.png"
                alt="QUÁ TRÌNH CÔNG TÁC"
                width={1024}
                height={160}
                className="leader-detail-work-heading-image"
              />
            </h3>
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
            <h3 className="leader-detail-awards-heading">
              <Image
                src="/images/awards-header.png"
                alt="PHẦN THƯỞNG CAO QUÝ"
                width={1024}
                height={160}
                className="leader-detail-awards-heading-image"
              />
            </h3>
            <ul className="leader-detail-awards-list leader-modal-scroll">
              {awards.map((award, index) => (
                <li key={`${award.title}-${index}`}>
                  <span className="leader-detail-award-icon" aria-hidden>
                    <Image
                      src="/images/award-icon.png"
                      alt=""
                      width={32}
                      height={32}
                      className="leader-detail-award-image"
                    />
                  </span>
                  <span>{award.title}</span>
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

function buildWorkEvents(leader: Leader): TimelineEvent[] {
  if (leader.timeline.length > 0) return leader.timeline;

  return formatPositionNewestFirst(leader.position)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      year: extractYearLabel(line),
      event: line,
      description: line,
      sort: index + 1,
    }));
}

function buildProfileMeta(biography: string): { birthYear?: string; hometown?: string } | null {
  const birthYear = biography.match(/sinh\s+năm\s*[:：]?\s*([^;.]+)/i)?.[1]?.trim();
  const hometown = biography.match(/quê\s+quán\s*[:：]\s*([^;.]+)/i)?.[1]?.trim();

  if (!birthYear && !hometown) return null;
  return { birthYear, hometown };
}

function extractYearLabel(text: string): string {
  const monthYear = text.match(/\b\d{1,2}\/\d{4}\b/);
  if (monthYear) return monthYear[0];

  const range = text.match(/\b\d{4}\s*[-–]\s*(?:\d{4}|Nay)\b/i);
  if (range) return range[0].replace(/\s+/g, "");

  const year = text.match(/\b\d{4}\b/);
  return year?.[0] ?? "";
}

function normalizeAwards(awards: Array<string | AwardItem>): AwardItem[] {
  return awards.map((award, index) =>
    typeof award === "string"
      ? { title: award, sort: index + 1 }
      : { title: award.title, sort: award.sort ?? index + 1 }
  );
}

function sortItemsBySort<T extends { sort?: number }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const sortA = typeof a.item.sort === "number" ? a.item.sort : a.index + 1;
      const sortB = typeof b.item.sort === "number" ? b.item.sort : b.index + 1;
      return sortA - sortB || a.index - b.index;
    })
    .map(({ item }) => item);
}

function buildAwards(): AwardItem[] {
  return [
    { title: "Huân chương chiến công hạng Nhất", sort: 1 },
    { title: "Huân chương chiến công hạng Ba", sort: 2 },
    { title: "02 Bằng khen của Thủ tướng Chính phủ", sort: 3 },
    { title: "Nhiều phần thưởng cao quý khác", sort: 4 },
  ];
}
