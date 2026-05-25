import type { Leader } from "@/types";

const FALLBACK_PORTRAIT = "/images/portrait-placeholder.png";

export function getHomePortraitUrl(leader: Leader): string {
  return leader.homePortraitUrl || leader.portraitUrl || leader.detailPortraitUrl || FALLBACK_PORTRAIT;
}

export function getDetailPortraitUrl(leader: Leader): string {
  return leader.detailPortraitUrl || leader.homePortraitUrl || leader.portraitUrl || FALLBACK_PORTRAIT;
}
