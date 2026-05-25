import { NextRequest, NextResponse } from "next/server";
import {
  deleteLeader,
  readLeaders,
  sortLeaders,
  upsertLeader,
} from "@/lib/leaders-store";
import { sortTimelineEventsNewestFirst } from "@/lib/sort-timeline";
import type { Leader, LeaderInput } from "@/types";

function isValidLeaderInput(body: unknown): body is LeaderInput {
  if (!body || typeof body !== "object") return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.position === "string" &&
    typeof candidate.biography === "string" &&
    (candidate.tier === "top" || candidate.tier === "bottom") &&
    Array.isArray(candidate.timeline) &&
    (candidate.portraitUrl === undefined ||
      typeof candidate.portraitUrl === "string") &&
    (candidate.homePortraitUrl === undefined ||
      typeof candidate.homePortraitUrl === "string") &&
    (candidate.detailPortraitUrl === undefined ||
      typeof candidate.detailPortraitUrl === "string") &&
    (candidate.sortOrder === undefined || typeof candidate.sortOrder === "number") &&
    (candidate.awards === undefined || Array.isArray(candidate.awards))
  );
}

function normalizeLeader(input: LeaderInput, existing?: Leader): Leader {
  const id =
    (typeof input.id === "string" && input.id.trim()) ||
    existing?.id ||
    `leader-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const timeline = sortTimelineEventsNewestFirst(
    input.timeline.map((item) => ({
      year: String(item.year).trim(),
      event: String(item.event).trim(),
      description: String(item.description).trim(),
    }))
  );
  const awards = Array.isArray(input.awards)
    ? input.awards.map((item) => String(item).trim()).filter(Boolean)
    : existing?.awards;

  const legacyPortraitUrl =
    (typeof input.portraitUrl === "string" && input.portraitUrl.trim()) ||
    existing?.portraitUrl ||
    "";
  const homePortraitUrl =
    (typeof input.homePortraitUrl === "string" && input.homePortraitUrl.trim()) ||
    existing?.homePortraitUrl ||
    legacyPortraitUrl ||
    "/images/portrait-placeholder.png";
  const detailPortraitUrl =
    (typeof input.detailPortraitUrl === "string" && input.detailPortraitUrl.trim()) ||
    existing?.detailPortraitUrl ||
    legacyPortraitUrl ||
    homePortraitUrl;

  return {
    id,
    name: input.name.trim(),
    position: input.position.trim(),
    portraitUrl: homePortraitUrl,
    homePortraitUrl,
    detailPortraitUrl,
    biography: input.biography.trim(),
    tier: input.tier,
    sortOrder:
      typeof input.sortOrder === "number" && input.sortOrder > 0
        ? input.sortOrder
        : (existing?.sortOrder ?? 1),
    timeline,
    awards,
  };
}

export async function GET(): Promise<NextResponse<Leader[]>> {
  const leaders = sortLeaders(await readLeaders());
  return NextResponse.json(leaders, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();

    if (!isValidLeaderInput(body)) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường bắt buộc." },
        { status: 400 }
      );
    }

    const payload = body as LeaderInput;
    const leaders = await readLeaders();
    const existing = payload.id
      ? leaders.find((l) => l.id === payload.id)
      : undefined;

    const leader = normalizeLeader(payload, existing);
    const isUpdate = Boolean(existing);

    if (!isUpdate && leaders.some((l) => l.id === leader.id)) {
      return NextResponse.json(
        { error: "ID đã tồn tại. Vui lòng chọn ID khác." },
        { status: 409 }
      );
    }

    await upsertLeader(leader);
    return NextResponse.json(leader, { status: isUpdate ? 200 : 201 });
  } catch {
    return NextResponse.json(
      { error: "Không thể xử lý yêu cầu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const id = request.nextUrl.searchParams.get("id")?.trim();
  if (!id) {
    return NextResponse.json(
      { error: "Thiếu tham số id." },
      { status: 400 }
    );
  }

  try {
    const removed = await deleteLeader(id);
    if (!removed) {
      return NextResponse.json(
        { error: "Không tìm thấy lãnh đạo." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, id: removed.id });
  } catch {
    return NextResponse.json(
      { error: "Không thể xóa lãnh đạo." },
      { status: 500 }
    );
  }
}
