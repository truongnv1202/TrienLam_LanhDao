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
  ImageIcon,
} from "lucide-react";
import type { Leader, LeaderTier, TimelineEvent } from "@/types";

interface FormState {
  id: string;
  name: string;
  position: string;
  portraitUrl: string;
  biography: string;
  tier: LeaderTier;
  sortOrder: number;
}

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  position: "",
  portraitUrl: "",
  biography: "",
  tier: "bottom",
  sortOrder: 1,
};

const EMPTY_MILESTONE: TimelineEvent = {
  year: "",
  event: "",
  description: "",
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
  const [milestoneDraft, setMilestoneDraft] = useState<TimelineEvent>(EMPTY_MILESTONE);
  const [isEditing, setIsEditing] = useState(false);
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [portraitPreview, setPortraitPreview] = useState<string | null>(null);

  const fetchLeaders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaders");
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
      if (portraitPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(portraitPreview);
      }
    };
  }, [portraitPreview]);

  const clearPortraitSelection = () => {
    if (portraitPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(portraitPreview);
    }
    setPortraitFile(null);
    setPortraitPreview(null);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setTimeline([]);
    setMilestoneDraft(EMPTY_MILESTONE);
    setIsEditing(false);
    clearPortraitSelection();
    setMessage(null);
  };

  const handleEdit = (leader: Leader) => {
    setForm({
      id: leader.id,
      name: leader.name,
      position: leader.position,
      portraitUrl: leader.portraitUrl,
      biography: leader.biography,
      tier: leader.tier,
      sortOrder: leader.sortOrder ?? 1,
    });
    setTimeline([...leader.timeline]);
    setMilestoneDraft(EMPTY_MILESTONE);
    setIsEditing(true);
    clearPortraitSelection();
    setPortraitPreview(leader.portraitUrl || null);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePortraitFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (portraitPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(portraitPreview);
    }
    setPortraitFile(file);
    setPortraitPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const uploadPortrait = async (leaderId: string): Promise<string | null> => {
    if (!portraitFile) return form.portraitUrl.trim() || null;

    const body = new FormData();
    body.append("file", portraitFile);
    body.append("leaderId", leaderId);

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
      !milestoneDraft.year.trim() ||
      !milestoneDraft.event.trim() ||
      !milestoneDraft.description.trim()
    ) {
      setMessage({
        type: "err",
        text: "Vui lòng nhập đầy đủ Năm, Sự kiện và Mô tả trước khi thêm mốc.",
      });
      return;
    }
    setTimeline((prev) => [
      ...prev,
      {
        year: milestoneDraft.year.trim(),
        event: milestoneDraft.event.trim(),
        description: milestoneDraft.description.trim(),
      },
    ]);
    setMilestoneDraft(EMPTY_MILESTONE);
    setMessage(null);
  };

  const removeMilestone = (index: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
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
      let portraitUrl = form.portraitUrl.trim();
      if (portraitFile) {
        const uploaded = await uploadPortrait(leaderId);
        if (uploaded) portraitUrl = uploaded;
      }

      const payload: Leader = {
        id: leaderId,
        sortOrder: form.sortOrder,
        name: form.name.trim(),
        position: form.position.trim(),
        portraitUrl:
          portraitUrl ||
          `/images/portraits/${leaderId}.png`,
        biography: form.biography.trim(),
        tier: form.tier,
        timeline,
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
        setForm((f) => ({ ...f, id: saved.id, portraitUrl: saved.portraitUrl }));
        setPortraitPreview(saved.portraitUrl);
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

  const previewSrc = portraitPreview || form.portraitUrl || null;

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
                Ảnh chân dung
              </legend>

              {previewSrc && (
                <div className="leader-portrait-frame relative mx-auto mb-3 h-44 w-36 overflow-hidden rounded-lg border border-[#d4af37]/50">
                  <Image
                    src={previewSrc}
                    alt="Xem trước ảnh"
                    fill
                    unoptimized={previewSrc.startsWith("blob:")}
                    className="object-contain object-bottom"
                    sizes="144px"
                  />
                </div>
              )}

              <label
                htmlFor="portraitFile"
                className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-[#d4af37]/50 bg-[#800000]/60 py-2.5 text-sm text-[#ffdf7a] transition hover:bg-[#a30000]/60"
              >
                <Upload className="h-4 w-4" />
                {portraitFile ? "Đổi ảnh tải lên" : "Chọn ảnh từ máy (tối đa 5MB)"}
              </label>
              <input
                id="portraitFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={handlePortraitFileChange}
              />

              <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-[#d4af37]/70">
                hoặc dán URL
              </p>

              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]/60" />
                <input
                  id="portraitUrl"
                  type="url"
                  value={form.portraitUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setForm((f) => ({ ...f, portraitUrl: url }));
                    if (!portraitFile) setPortraitPreview(url || null);
                  }}
                  className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#ffdf7a]"
                  placeholder="https://... hoặc /uploads/portraits/..."
                />
              </div>
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

              <div className="mt-2 grid gap-3 sm:grid-cols-3">
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
                  className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white sm:col-span-3"
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
                <ul className="mt-4 space-y-2">
                  {timeline.map((item, index) => (
                    <li
                      key={`${item.year}-${index}`}
                      className="flex items-start justify-between gap-2 rounded-md bg-[#4a0000]/50 px-3 py-2 text-xs"
                    >
                      <span className="text-white/90">
                        <strong className="text-[#ffdf7a]">{item.year}</strong> —{" "}
                        {item.event}: {item.description}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMilestone(index)}
                        className="shrink-0 text-red-300 hover:text-red-100"
                        aria-label="Xóa mốc"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
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
                        src={leader.portraitUrl}
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
                          {leader.timeline.length} mốc
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
