"use client";

import { useCallback, useEffect, useState, FormEvent } from "react";
import {
  Plus,
  Save,
  Pencil,
  Trash2,
  Loader2,
  ListPlus,
  RotateCcw,
} from "lucide-react";
import type { Leader, LeaderTier, TimelineEvent } from "@/types";

interface FormState {
  id: string;
  name: string;
  position: string;
  portraitUrl: string;
  biography: string;
  tier: LeaderTier;
}

const EMPTY_FORM: FormState = {
  id: "",
  name: "",
  position: "",
  portraitUrl: "",
  biography: "",
  tier: "bottom",
};

const EMPTY_MILESTONE: TimelineEvent = {
  year: "",
  event: "",
  description: "",
};

export default function AdminPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [milestoneDraft, setMilestoneDraft] = useState<TimelineEvent>(EMPTY_MILESTONE);
  const [isEditing, setIsEditing] = useState(false);

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

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setTimeline([]);
    setMilestoneDraft(EMPTY_MILESTONE);
    setIsEditing(false);
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
    });
    setTimeline([...leader.timeline]);
    setMilestoneDraft(EMPTY_MILESTONE);
    setIsEditing(true);
    setMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.position.trim()) {
      setMessage({ type: "err", text: "Họ tên và chức vụ là bắt buộc." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const payload: Leader = {
      id: form.id.trim() || `leader-${Date.now()}`,
      name: form.name.trim(),
      position: form.position.trim(),
      portraitUrl:
        form.portraitUrl.trim() ||
        "https://placehold.co/400x520/800000/d4af37?text=Anh+chan+dung",
      biography: form.biography.trim(),
      tier: form.tier,
      timeline,
    };

    try {
      const res = await fetch("/api/leaders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: unknown = await res.json();
      if (!res.ok) {
        const err =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: string }).error === "string"
            ? (data as { error: string }).error
            : "Lưu thất bại.";
        throw new Error(err);
      }
      setMessage({
        type: "ok",
        text: isEditing ? "Cập nhật thành công." : "Thêm mới thành công.",
      });
      await fetchLeaders();
      if (!isEditing) resetForm();
    } catch (err) {
      setMessage({
        type: "err",
        text: err instanceof Error ? err.message : "Lưu thất bại.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] bg-gradient-to-b from-[#800000] via-[#6b0000] to-[#4a0000]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <header className="mb-8 border-b border-[#d4af37]/30 pb-4">
          <h1 className="text-2xl font-bold text-[#ffdf7a] sm:text-3xl">
            Quản trị nội dung
          </h1>
          <p className="mt-1 text-sm text-white/75">
            Thêm mới hoặc chỉnh sửa thông tin lãnh đạo và các mốc timeline
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form — trái */}
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

            <div>
              <label
                htmlFor="portraitUrl"
                className="mb-1 block text-xs font-medium text-[#d4af37]"
              >
                URL ảnh chân dung
              </label>
              <input
                id="portraitUrl"
                type="url"
                value={form.portraitUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, portraitUrl: e.target.value }))
                }
                className="w-full rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white outline-none focus:border-[#ffdf7a] focus:ring-1 focus:ring-[#ffdf7a]/50"
                placeholder="https://..."
              />
            </div>

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

            {/* Timeline động */}
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
                  className="rounded-md border border-[#d4af37]/40 bg-[#4a0000]/70 px-3 py-2 text-sm text-white sm:col-span-1"
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

          {/* Danh sách — phải */}
          <section className="rounded-xl border border-[#d4af37]/35 bg-[#5c0000]/40 p-5 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-[#ffdf7a]">
              Danh sách lãnh đạo
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
                    className="flex flex-col gap-2 rounded-lg border border-[#d4af37]/25 bg-[#4a0000]/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#ffdf7a]">{leader.name}</p>
                      <p className="text-xs text-white/75">{leader.position}</p>
                      <p className="mt-1 text-[10px] uppercase text-[#d4af37]/80">
                        {leader.tier === "top" ? "Hàng trên" : "Hàng dưới"} ·{" "}
                        {leader.timeline.length} mốc
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEdit(leader)}
                      className="flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#d4af37]/50 px-3 py-1.5 text-sm text-[#ffdf7a] transition hover:bg-[#800000]/70"
                    >
                      <Pencil className="h-4 w-4" />
                      Sửa
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
