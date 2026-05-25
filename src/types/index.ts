export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
}

export type LeaderTier = "top" | "bottom";

export interface Leader {
  id: string;
  name: string;
  position: string;
  /** Trường cũ, dùng làm fallback cho dữ liệu đã có. */
  portraitUrl: string;
  /** Ảnh dùng cho thẻ lãnh đạo ngoài trang chủ. */
  homePortraitUrl?: string;
  /** Ảnh dùng cho popup chi tiết lãnh đạo. */
  detailPortraitUrl?: string;
  biography: string;
  tier: LeaderTier;
  /** Thứ tự hiển thị trong hàng (1–6 trên, 1–7 dưới) */
  sortOrder: number;
  timeline: TimelineEvent[];
  awards?: string[];
}

export type LeaderInput = Omit<Leader, "id" | "portraitUrl"> & {
  id?: string;
  portraitUrl?: string;
  sortOrder?: number;
};
