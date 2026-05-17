export interface TimelineEvent {
  year: string;
  event: string;
  description: string;
}

export type LeaderTier = "top" | "bottom";

export interface Leader {
  id: string;
  /** Thứ tự hiển thị trên trang triển lãm (1–13) */
  sortOrder: number;
  name: string;
  position: string;
  portraitUrl: string;
  biography: string;
  tier: LeaderTier;
  timeline: TimelineEvent[];
}

export type LeaderInput = Omit<Leader, "id" | "portraitUrl"> & {
  id?: string;
  portraitUrl?: string;
};
