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
  timeline: TimelineEvent[];
}

export type LeaderInput = Omit<Leader, "id"> & { id?: string };
