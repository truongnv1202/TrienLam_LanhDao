"use client";

import { useCallback, useEffect, useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import {
  Plus,
  Save,
  Pencil,
  Trash2,
  Loader2,
  ListPlus,
  RotateCcw,
  Upload,
} from "lucide-react";
import { getDetailPortraitUrl, getHomePortraitUrl } from "@/lib/leader-images";
import type { AwardItem, Leader, LeaderTier, TimelineEvent } from "@/types";

interface FormState {
  id: string;
  name: string;
  position: string;
  homePortraitUrl: string;
  detailPortraitUrl: string;
  biography: string;
  tier: LeaderTier;
  sortOrder: number;
}

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  position: "",
  homePortraitUrl: "",
  detailPortraitUrl: "",
  biography: "",
  tier: "bottom",
  sortOrder: 1,
};

const EMPTY_MILESTONE: TimelineEvent = {
  year: "",
  event: "",
  description: "",
  sort: 1,
};

const EMPTY_AWARD: AwardItem = {
  title: "",
  sort: 1,
};

function parseApiError(data: unknown, fallback: string): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "error" in data &&
    typeof (data as { error: string }).error === "string"
  ) {
    return (data as { error: string }).error;
  }
  return fallback;
}

function normalizeAwardsForForm(awards: Leader["awards"]): AwardItem[] {
  return (awards ?? []).map((award, index) =>
    typeof award === "string"
      ? { title: award, sort: index + 1 }
      : { title: award.title, sort: award.sort ?? index + 1 }
  );
}

export default function AdminPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [awards, setAwards] = useState<AwardItem[]>([]);
  const [milestoneDraft, setMilestoneDraft] = useState<TimelineEvent>(EMPTY_MILESTONE);
  const [awardDraft, setAwardDraft] = useState<AwardItem>(EMPTY_AWARD);
  const [isEditing, setIsEditing] = useState(false);
  const [homePortraitFile, setHomePortraitFile] = useState<File | null>(null);
  const [detailPortraitFile, setDetailPortraitFile] = useState<File | null>(null);
  const [homePortraitPreview, setHomePortraitPreview] = useState<string | null>(null);
  const [detailPortraitPreview, setDetailPortraitPreview] = useState<string | null>(null);

  const fetchLeaders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaders", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data: Leader[] = await res.json();
      setLeaders(data);
    } catch {
      setMessage({ type: "err", text: "Không tải được danh sách." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchLeaders();
  }, [fetchLeaders]);

  useEffect(() => {
    return () => {
      if (homePortraitPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(homePortraitPreview);
      }
      if (detailPortraitPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(detailPortraitPreview);
      }
    };
  }, [homePortraitPreview, detailPortraitPreview]);

  const clearPortraitSelection = () => {
    if (homePortraitPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(homePortraitPreview);
    }
    if (detailPortraitPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(detailPortraitPreview);
    }
    setHomePortraitFile(null);
    setDetailPortraitFile(null);
    setHomePortraitPreview(null);
    setDetailPortraitPreview(null);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setTimeline([]);
    setAwards([]);
    setMilestoneDraft(EMPTY_MILESTONE);
    setAwardDraft(EMPTY_AWARD);
    setIsEditing(false);
    clearPortraitSelection();
    setMessage(null);
  };

  const handleEdit = (leader: Leader) => {
    setForm({
      id: leader.id,
      name: leader.name,
      position: leader.position,
      homePortraitUrl: getHomePortraitUrl(leader),
      detailPortraitUrl: getDetailPortraitUrl(leader),
      biography: leader.biography,
      tier: leader.tier,
      sortOrder: leader.sortOrder ?? 1,
    });
    setTimeline(
      leader.timeline.map((item, index) => ({
        ...item,
        sort: item.sort ?? index + 1,
      }))
    );
    setAwards(normalizeAwardsForForm(leader.awards));
    setMilestoneDraft({ ...EMPTY_MILESTONE, sort: leader.timeline.length + 1 });
    setAwardDraft({ ...EMPTY_AWARD, sort: (leader.awards?.length ?? 0) + 1 });
    setIsEditing(true);
    clearPortraitSelection();
    setHomePortraitPreview(getHomePortraitUrl(leader));
    setDetailPortraitPreview(getDetailPortraitUrl(leader));
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePortraitFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    target: "home" | "detail"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "home") {
      if (homePortraitPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(homePortraitPreview);
      }
      setHomePortraitFile(file);
      setHomePortraitPreview(URL.createObjectURL(file));
    } else {
      if (detailPortraitPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(detailPortraitPreview);
      }
      setDetailPortraitFile(file);
      setDetailPortraitPreview(URL.createObjectURL(file));
    }
    setMessage(null);
  };

  const uploadPortrait = async (
    file: File | null,
    target: "home" | "popup",
    uploadId: string,
    fallbackUrl: string
  ): Promise<string | null> => {
    if (!file) return fallbackUrl.trim() || null;

    const body = new FormData();
    body.append("file", file);
    body.append("leaderId", uploadId);
    body.append("target", target);

    const res = await fetch("/api/leaders/upload", {
      method: "POST",
      body,
    });
    const data: unknown = await res.json();
    if (!res.ok) {
      throw new Error(parseApiError(data, "Tải ảnh thất bại."));
    }
    if (
      typeof data === "object" &&
      data !== null &&
      "url" in data &&
      typeof (data as { url: string }).url === "string"
    ) {
      return (data as { url: string }).url;
    }
    throw new Error("Phản hồi upload không hợp lệ.");
  };

  const addMilestone = () => {
    if (
      !milestoneDraft.event.trim() ||
      !milestoneDraft.description.trim()
    ) {
      setMessage({
        type: "err",
        text: "Vui lòng nhập đầy đủ Sự kiện và Mô tả trước khi thêm mốc.",
      });
      return;
    }
    setTimeline((prev) => [
      ...prev,
      {
        year: milestoneDraft.year.trim(),
        event: milestoneDraft.event.trim(),
        description: milestoneDraft.description.trim(),
        sort: milestoneDraft.sort,
      },
    ]);
    setMilestoneDraft({ ...EMPTY_MILESTONE, sort: timeline.length + 2 });
    setMessage(null);
  };

  const removeMilestone = (index: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMilestone = (
    index: number,
    field: keyof TimelineEvent,
    value: string | number | undefined
  ) => {
    setTimeline((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addAward = () => {
    const value = awardDraft.title.trim();
    if (!value) {
      setMessage({
        type: "err",
        text: "Vui lòng nhập nội dung phần thưởng trước khi thêm.",
      });
      return;
    }

    setAwards((prev) => [...prev, { title: value, sort: awardDraft.sort }]);
    setAwardDraft({ ...EMPTY_AWARD, sort: awards.length + 2 });
    setMessage(null);
  };

  const updateAward = (
    index: number,
    field: keyof AwardItem,
    value: string | number | undefined
  ) => {
    setAwards((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeAward = (index: number) => {
    setAwards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (leader: Leader) => {
    const confirmed = window.confirm(
      `Xóa "${leader.name}"? Hành động không thể hoàn tác.`
    );
    if (!confirmed) return;

    setDeletingId(leader.id);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/leaders?id=${encodeURIComponent(leader.id)}`,
        { method: "DELETE" }
      );
      const data: unknown = await res.json();
      if (!res.ok) {
        throw new Error(parseApiError(data, "Xóa thất bại."));
      }
      setMessage({ type: "ok", text: `Đã xóa ${leader.name}.` });
      if (form.id === leader.id) resetForm();
      await fetchLeaders();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Xóa thất bại.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.position.trim()) {
      setMessage({ type: "err", text: "Họ tên và chức vụ là bắt buộc." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const leaderId = form.id.trim() || `leader-${Date.now()}`;

    try {
      let homePortraitUrl = form.homePortraitUrl.trim();
      let detailPortraitUrl = form.detailPortraitUrl.trim();

      const uploadedHomePortrait = await uploadPortrait(
        homePortraitFile,
        "home",
        leaderId,
        homePortraitUrl
      );
      if (uploadedHomePortrait) homePortraitUrl = uploadedHomePortrait;

      const uploadedDetailPortrait = await uploadPortrait(
        detailPortraitFile,
        "popup",
        leaderId,
        detailPortraitUrl
      );
      if (uploadedDetailPortrait) detailPortraitUrl = uploadedDetailPortrait;

      if (!detailPortraitUrl) detailPortraitUrl = homePortraitUrl;

      const payload: Leader = {
        id: leaderId,
        sortOrder: form.sortOrder,
        name: form.name.trim(),
        position: form.position.trim(),
        portraitUrl:
          homePortraitUrl ||
          detailPortraitUrl ||
          "/images/portrait-placeholder.png",
        homePortraitUrl:
          homePortraitUrl ||
          detailPortraitUrl ||
          "/images/portrait-placeholder.png",
        detailPortraitUrl:
          detailPortraitUrl ||
          homePortraitUrl ||
          "/images/portrait-placeholder.png",
        biography: form.biography.trim(),
        tier: form.tier,
        timeline: timeline.map((item) => ({
          year: item.year.trim(),
          event: item.event.trim(),
          description: item.description.trim(),
          sort: item.sort,
        })),
        awards: awards
          .map((item) => ({
            title: item.title.trim(),
            sort: item.sort,
          }))
          .filter((item) => item.title.length > 0),
      };

      const res = await fetch("/api/leaders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        throw new Error(parseApiError(data, "Lưu thất bại."));
      }

      setMessage({
        type: "ok",
        text: isEditing ? "Cập nhật thành công." : "Thêm mới thành công.",
      });
      clearPortraitSelection();
      await fetchLeaders();
      if (!isEditing) resetForm();
      else if (typeof data === "object" && data !== null && "portraitUrl" in data) {
        const saved = data as Leader;
        setForm((f) => ({
          ...f,
          id: saved.id,
          homePortraitUrl: getHomePortraitUrl(saved),
          detailPortraitUrl: getDetailPortraitUrl(saved),
        }));
        setHomePortraitPreview(getHomePortraitUrl(saved));
        setDetailPortraitPreview(getDetailPortraitUrl(saved));
      }
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Lưu thất bại.",
      });
    } finally {
      setSaving(false);
    }
  };

  const homePreviewSrc = homePortraitPreview || form.homePortraitUrl || null;
  const detailPreviewSrc = detailPortraitPreview || form.detailPortraitUrl || null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-8 border-b border-[#d4af37]/30 pb-4">
          <h1 className="text-2xl font-bold text-[#ffdf7a] sm:text-3xl">
            Quản lý lãnh đạo
          </h1>
          <p className="mt-1 text-sm text-white/75">
            Thêm, sửa, xóa lãnh đạo — upload ảnh chân dung hoặc dán URL
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl border border-[#d4af37]/35 bg-[#5c0000]/60 p-5 shadow-lg backdrop-blur sm:p-6"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-[#ffdf7a]">
                {isEditing ? "Chỉnh sửa lãnh đạo" : "Thêm lãnh đạo mới"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-1 rounded-md border border-[#d4af37]/40 px-2 py-1 text-xs text-[#ffdf7a] transition hover:bg-[#800000]/50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Làm mới
              </button>
            </div>

            {message && (
              <p
                className={[
                  "rounded-md px-3 py-2 text-sm",
                  message.type === "ok"
                    ? "border border-green-400/40 bg-green-900/30 text-green-100"
                    : "border border-red-400/40 bg-red-900/30 text-red-100",
                ].join(" ")}
              >
                {message.text}
              </p>
            )}

            {isEditing && (
              <div>
                <label className="mb-1 block text-xs font-medium text-[#d4af37]">
                  ID (không đổi khi sửa)
                </label>
                <input
                  type="text"
                  value={form.id}
                  readOnly
                  className="w-full rounded-md border border-[#d4af37]/30 bg-[#4a0000]/50 px-3 py-2 text-sm text-white/70"
                />
              </div>
            )}

            <div>
              <label htmlFor="name" className="mb-1 block text-xs font-medium text-[#d4af37]">
                Họ và tên *
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white outline-none focus:border-[#ffdf7a] focus:ring-1 focus:ring-[#ffdf7a]/50"
                placeholder="Ví dụ: Đại tướng Tô Lâm"
              />
            </div>

            <div>
              <label
                htmlFor="position"
                className="mb-1 block text-xs font-medium text-[#d4af37]"
              >
                Chức vụ tóm tắt *
              </label>
              <input
                id="position"
                type="text"
                required
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white outline-none focus:border-[#ffdf7a] focus:ring-1 focus:ring-[#ffdf7a]/50"
              />
            </div>

            {/* Ảnh chân dung */}
            <fieldset className="rounded-lg border border-dashed border-[#d4af37]/40 p-4">
              <legend className="px-2 text-sm font-semibold text-[#ffdf7a]">
                Ảnh lãnh đạo
              </legend>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-[#d4af37]/25 bg-[#4a0000]/35 p-3">
                  <p className="mb-2 text-sm font-semibold text-[#ffdf7a]">
                    Ảnh ngoài trang chủ
                  </p>
                  {homePreviewSrc && (
                    <div className="leader-portrait-frame relative mx-auto mb-3 h-44 w-36 overflow-hidden rounded-lg border border-[#d4af37]/50">
                      <Image
                        src={homePreviewSrc}
                        alt="Xem trước ảnh trang chủ"
                        fill
                        unoptimized={homePreviewSrc.startsWith("blob:")}
                        className="object-contain object-bottom"
                        sizes="144px"
                      />
                    </div>
                  )}
                  <label
                    htmlFor="homePortraitFile"
                    className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-[#d4af37]/50 bg-[#800000]/60 py-2.5 text-sm text-[#ffdf7a] transition hover:bg-[#a30000]/60"
                  >
                    <Upload className="h-4 w-4" />
                    {homePortraitFile ? "Đổi ảnh trang chủ" : "Chọn ảnh trang chủ"}
                  </label>
                  <input
                    id="homePortraitFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(e) => handlePortraitFileChange(e, "home")}
                  />
                  <label
                    htmlFor="homePortraitUrl"
                    className="mb-1 block text-xs font-medium text-[#d4af37]"
                  >
                    Trường lưu ảnh trang chủ
                  </label>
                  <input
                    id="homePortraitUrl"
                    type="text"
                    value={form.homePortraitUrl}
                    onChange={(e) => {
                      if (homePortraitPreview?.startsWith("blob:")) {
                        URL.revokeObjectURL(homePortraitPreview);
                      }
                      setHomePortraitFile(null);
                      setHomePortraitPreview(null);
                      setForm((f) => ({ ...f, homePortraitUrl: e.target.value }));
                    }}
                    className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-xs text-white outline-none focus:border-[#ffdf7a]"
                    placeholder="/uploads/home_....png"
                  />
                </div>

                <div className="rounded-lg border border-[#d4af37]/25 bg-[#4a0000]/35 p-3">
                  <p className="mb-2 text-sm font-semibold text-[#ffdf7a]">
                    Ảnh trong popup
                  </p>
                  {detailPreviewSrc && (
                    <div className="leader-portrait-frame relative mx-auto mb-3 h-44 w-36 overflow-hidden rounded-lg border border-[#d4af37]/50">
                      <Image
                        src={detailPreviewSrc}
                        alt="Xem trước ảnh popup"
                        fill
                        unoptimized={detailPreviewSrc.startsWith("blob:")}
                        className="object-contain object-bottom"
                        sizes="144px"
                      />
                    </div>
                  )}
                  <label
                    htmlFor="detailPortraitFile"
                    className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-[#d4af37]/50 bg-[#800000]/60 py-2.5 text-sm text-[#ffdf7a] transition hover:bg-[#a30000]/60"
                  >
                    <Upload className="h-4 w-4" />
                    {detailPortraitFile ? "Đổi ảnh popup" : "Chọn ảnh popup"}
                  </label>
                  <input
                    id="detailPortraitFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    onChange={(e) => handlePortraitFileChange(e, "detail")}
                  />
                  <label
                    htmlFor="detailPortraitUrl"
                    className="mb-1 block text-xs font-medium text-[#d4af37]"
                  >
                    Trường lưu ảnh trong popup
                  </label>
                  <input
                    id="detailPortraitUrl"
                    type="text"
                    value={form.detailPortraitUrl}
                    onChange={(e) => {
                      if (detailPortraitPreview?.startsWith("blob:")) {
                        URL.revokeObjectURL(detailPortraitPreview);
                      }
                      setDetailPortraitFile(null);
                      setDetailPortraitPreview(null);
                      setForm((f) => ({ ...f, detailPortraitUrl: e.target.value }));
                    }}
                    className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-xs text-white outline-none focus:border-[#ffdf7a]"
                    placeholder="/uploads/popup_....png"
                  />
                </div>
              </div>

              <p className="text-center text-xs text-[#d4af37]/75">
                Ảnh sẽ được lưu vào <code>/opt/TrienLam_LanhDao/public/uploads</code> với tiền tố <code>home_</code> hoặc <code>popup_</code>.
              </p>
            </fieldset>

            <div>
              <label
                htmlFor="biography"
                className="mb-1 block text-xs font-medium text-[#d4af37]"
              >
                Tiểu sử
              </label>
              <textarea
                id="biography"
                rows={4}
                value={form.biography}
                onChange={(e) =>
                  setForm((f) => ({ ...f, biography: e.target.value }))
                }
                className="w-full resize-y rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white outline-none focus:border-[#ffdf7a] focus:ring-1 focus:ring-[#ffdf7a]/50"
              />
            </div>

            <div>
              <label htmlFor="sortOrder" className="mb-1 block text-xs font-medium text-[#d4af37]">
                Thứ tự hiển thị (1–13)
              </label>
              <input
                id="sortOrder"
                type="number"
                min={1}
                max={99}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sortOrder: Number(e.target.value) || 1,
                  }))
                }
                className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white outline-none focus:border-[#ffdf7a]"
              />
            </div>

            <div>
              <label htmlFor="tier" className="mb-1 block text-xs font-medium text-[#d4af37]">
                Cấp hiển thị (Tier)
              </label>
              <select
                id="tier"
                value={form.tier}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tier: e.target.value as LeaderTier,
                  }))
                }
                className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white outline-none focus:border-[#ffdf7a]"
              >
                <option value="top">Hàng trên (Top — lớn hơn 10%)</option>
                <option value="bottom">Hàng dưới (Bottom)</option>
              </select>
            </div>

            <fieldset className="rounded-lg border border-dashed border-[#d4af37]/40 p-4">
              <legend className="px-2 text-sm font-semibold text-[#ffdf7a]">
                Mốc Timeline
              </legend>

              <div className="mt-2 grid gap-3 sm:grid-cols-4">
                <input
                  type="number"
                  placeholder="Sort"
                  value={milestoneDraft.sort ?? ""}
                  onChange={(e) =>
                    setMilestoneDraft((m) => ({
                      ...m,
                      sort: e.target.value === "" ? undefined : Number(e.target.value),
                    }))
                  }
                  className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Năm"
                  value={milestoneDraft.year}
                  onChange={(e) =>
                    setMilestoneDraft((m) => ({ ...m, year: e.target.value }))
                  }
                  className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Sự kiện"
                  value={milestoneDraft.event}
                  onChange={(e) =>
                    setMilestoneDraft((m) => ({ ...m, event: e.target.value }))
                  }
                  className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Mô tả"
                  value={milestoneDraft.description}
                  onChange={(e) =>
                    setMilestoneDraft((m) => ({
                      ...m,
                      description: e.target.value,
                    }))
                  }
                  className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white sm:col-span-4"
                />
              </div>

              <button
                type="button"
                onClick={addMilestone}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[#d4af37]/50 bg-[#800000]/80 py-2 text-sm font-medium text-[#ffdf7a] transition hover:bg-[#a30000]/70"
              >
                <ListPlus className="h-4 w-4" />
                Thêm mốc
              </button>

              {timeline.length > 0 && (
                <div className="mt-4 space-y-3">
                  {timeline.map((item, index) => (
                    <div
                      key={`timeline-${index}`}
                      className="rounded-md border border-[#d4af37]/20 bg-[#4a0000]/50 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#ffdf7a]">
                          Mốc công tác #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeMilestone(index)}
                          className="shrink-0 text-red-300 hover:text-red-100"
                          aria-label="Xóa mốc"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-4">
                        <input
                          type="number"
                          value={item.sort ?? ""}
                          onChange={(e) =>
                            updateMilestone(
                              index,
                              "sort",
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
                          className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                          placeholder="Sort"
                        />
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateMilestone(index, "year", e.target.value)}
                          className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                          placeholder="Năm"
                        />
                        <input
                          type="text"
                          value={item.event}
                          onChange={(e) => updateMilestone(index, "event", e.target.value)}
                          className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white sm:col-span-2"
                          placeholder="Sự kiện"
                        />
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) =>
                            updateMilestone(index, "description", e.target.value)
                          }
                          className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white sm:col-span-4"
                          placeholder="Mô tả"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>

            <fieldset className="rounded-lg border border-dashed border-[#d4af37]/40 p-4">
              <legend className="px-2 text-sm font-semibold text-[#ffdf7a]">
                Phần thưởng cao quý
              </legend>

              <div className="mt-2 grid gap-2 sm:grid-cols-[100px_minmax(0,1fr)_auto]">
                <input
                  type="number"
                  placeholder="Sort"
                  value={awardDraft.sort ?? ""}
                  onChange={(e) =>
                    setAwardDraft((item) => ({
                      ...item,
                      sort: e.target.value === "" ? undefined : Number(e.target.value),
                    }))
                  }
                  className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                />
                <input
                  type="text"
                  placeholder="Nhập phần thưởng"
                  value={awardDraft.title}
                  onChange={(e) =>
                    setAwardDraft((item) => ({ ...item, title: e.target.value }))
                  }
                  className="min-w-0 flex-1 rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={addAward}
                  className="flex shrink-0 items-center gap-2 rounded-md border border-[#d4af37]/50 bg-[#800000]/80 px-3 py-2 text-sm font-medium text-[#ffdf7a] transition hover:bg-[#a30000]/70"
                >
                  <ListPlus className="h-4 w-4" />
                  Thêm
                </button>
              </div>

              {awards.length > 0 && (
                <div className="mt-4 space-y-3">
                  {awards.map((award, index) => (
                    <div
                      key={`award-${index}`}
                      className="rounded-md border border-[#d4af37]/20 bg-[#4a0000]/50 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-[#ffdf7a]">
                          Phần thưởng #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeAward(index)}
                          className="shrink-0 text-red-300 hover:text-red-100"
                          aria-label="Xóa phần thưởng"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[100px_minmax(0,1fr)]">
                        <input
                          type="number"
                          value={award.sort ?? ""}
                          onChange={(e) =>
                            updateAward(
                              index,
                              "sort",
                              e.target.value === "" ? undefined : Number(e.target.value)
                            )
                          }
                          className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                          placeholder="Sort"
                        />
                        <textarea
                          rows={2}
                          value={award.title}
                          onChange={(e) => updateAward(index, "title", e.target.value)}
                          className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white"
                          placeholder="Nội dung phần thưởng"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#d4af37] py-2.5 text-sm font-bold text-[#4a0000] transition hover:bg-[#ffdf7a] disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isEditing ? (
                <Save className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {isEditing ? "Lưu cập nhật" : "Lưu lãnh đạo mới"}
            </button>
          </form>

          <section className="rounded-xl border border-[#d4af37]/35 bg-[#5c0000]/40 p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#ffdf7a]">
              Danh sách lãnh đạo ({leaders.length})
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#ffdf7a]" />
              </div>
            ) : leaders.length === 0 ? (
              <p className="text-sm text-white/60">Chưa có dữ liệu.</p>
            ) : (
              <ul className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                {leaders.map((leader) => (
                  <li
                    key={leader.id}
                    className="flex gap-3 rounded-lg border border-[#d4af37]/25 bg-[#4a0000]/50 p-3"
                  >
                    <div className="leader-portrait-frame relative h-16 w-14 shrink-0 overflow-hidden rounded-md border border-[#d4af37]/40">
                      <Image
                        src={getHomePortraitUrl(leader)}
                        alt={leader.name}
                        fill
                        className="object-contain object-bottom"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#ffdf7a]">
                          {leader.name}
                        </p>
                        <p className="truncate text-xs text-white/75">
                          {leader.position}
                        </p>
                        <p className="mt-1 text-[10px] uppercase text-[#d4af37]/80">
                          {leader.tier === "top" ? "Hàng trên" : "Hàng dưới"} ·{" "}
                          {leader.timeline.length} mốc · {leader.awards?.length ?? 0} phần thưởng
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(leader)}
                          className="flex items-center gap-1 rounded-md border border-[#d4af37]/50 px-2.5 py-1.5 text-xs text-[#ffdf7a] transition hover:bg-[#800000]/70"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(leader)}
                          disabled={deletingId === leader.id}
                          className="flex items-center gap-1 rounded-md border border-red-400/50 px-2.5 py-1.5 text-xs text-red-200 transition hover:bg-red-900/40 disabled:opacity-50"
                        >
                          {deletingId === leader.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Xóa
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
      </div>
    </div>
  );
}
