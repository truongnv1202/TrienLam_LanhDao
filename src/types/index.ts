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
  portraitUrl: string;
  biography: string;
  tier: LeaderTier;
  /** Thứ tự hiển thị trong hàng (1–6 trên, 1–7 dưới) */
  sortOrder: number;
  timeline: TimelineEvent[];
}

export type LeaderInput = Omit<Leader, "id" | "portraitUrl"> & {
  id?: string;
  portraitUrl?: string;
  sortOrder?: number;
};
