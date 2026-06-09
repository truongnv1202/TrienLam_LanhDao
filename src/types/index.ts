export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
  /** Chỉ dùng để sắp xếp, không hiển thị ở giao diện popup. */
  sort?: number;
}

export interface AwardItem {
  title: string;
  /** Chỉ dùng để sắp xếp, không hiển thị ở giao diện popup. */
  sort?: number;
}

export type LeaderTier = "top" | "bottom";
export type LeaderDisplaySection =
  | "party"
  | "minister"
  | "deputy-1"
  | "deputy-2"
  | "hidden";

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
  /** Khu vực hiển thị trên màn chờ. */
  displaySection?: LeaderDisplaySection;
  /** Thứ tự trong khu vực hiển thị trên màn chờ. */
  displayOrder?: number;
  timeline: TimelineEvent[];
  awards?: Array<string | AwardItem>;
}

export type LeaderInput = Omit<Leader, "id" | "portraitUrl"> & {
  id?: string;
  portraitUrl?: string;
  sortOrder?: number;
};
