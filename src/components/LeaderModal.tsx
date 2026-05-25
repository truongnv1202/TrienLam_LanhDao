"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { formatPositionNewestFirst } from "@/lib/format-position";
import { sortTimelineEventsNewestFirst } from "@/lib/sort-timeline";
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

  const workEvents = sortTimelineEventsNewestFirst(buildWorkEvents(leader));
  const awards = sortAwardsByRank(leader.awards?.length ? leader.awards : buildAwards());
  const profileMeta = buildProfileMeta(leader.biography);
  const portraitSrc = leader.detailPortraitUrl || leader.portraitUrl;

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
                src={portraitSrc}
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
              {awards.map((award) => (
                <li key={award}>
                  <span className="leader-detail-award-icon" aria-hidden>
                    <Image
                      src="/images/award-icon.png"
                      alt=""
                      width={32}
                      height={32}
                      className="leader-detail-award-image"
                    />
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

function sortAwardsByRank(awards: string[]): string[] {
  return awards
    .map((award, index) => ({ award, index, rank: getAwardRank(award) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ award }) => award);
}

function getAwardRank(award: string): number {
  const text = normalizeText(award);
  if (text.includes("nhieu phan thuong")) return 990;

  const awardLevels = [
    ["huan chuong sao vang", 0],
    ["huan chuong ho chi minh", 10],
    ["anh hung luc luong vu trang", 20],
    ["anh hung lao dong", 21],
    ["huy hieu 50 nam", 30],
    ["huan chuong doc lap", 40],
    ["huan chuong quan cong", 50],
    ["huan chuong lao dong", 60],
    ["huan chuong chien cong", 70],
    ["huan chuong khang chien", 80],
    ["huan chuong huu nghi", 90],
    ["huan chuong tu do", 91],
    ["sahametrei", 92],
    ["6 thang 6", 93],
    ["huy chuong", 110],
    ["bang khen", 130],
  ] as const;

  const baseRank = awardLevels.find(([keyword]) => text.includes(keyword))?.[1] ?? 150;
  return baseRank + getAwardClassRank(text);
}

function getAwardClassRank(text: string): number {
  if (text.includes("hang nhat")) return 0;
  if (text.includes("hang nhi")) return 1;
  if (text.includes("hang ba")) return 2;
  return 5;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function buildAwards(): string[] {
  return [
    "Huân chương chiến công hạng Nhất",
    "Huân chương chiến công hạng Ba",
    "02 Bằng khen của Thủ tướng Chính phủ",
    "Nhiều phần thưởng cao quý khác",
  ];
}
