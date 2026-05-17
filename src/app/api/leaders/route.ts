import { NextRequest, NextResponse } from "next/server";
import {
  deleteLeader,
  readLeaders,
  sortLeaders,
  upsertLeader,
} from "@/lib/leaders-store";
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
    (candidate.sortOrder === undefined || typeof candidate.sortOrder === "number")
  );
}

function normalizeLeader(input: LeaderInput, existing?: Leader): Leader {
  const id =
    (typeof input.id === "string" && input.id.trim()) ||
    existing?.id ||
    `leader-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const timeline = input.timeline.map((item) => ({
    year: String(item.year).trim(),
    event: String(item.event).trim(),
    description: String(item.description).trim(),
  }));

  const portraitUrl =
    (typeof input.portraitUrl === "string" && input.portraitUrl.trim()) ||
    existing?.portraitUrl ||
    "https://placehold.co/400x520/800000/d4af37?text=Anh+chan+dung";

  return {
    id,
    name: input.name.trim(),
    position: input.position.trim(),
    portraitUrl,
    biography: input.biography.trim(),
    tier: input.tier,
    sortOrder:
      typeof input.sortOrder === "number" && input.sortOrder > 0
        ? input.sortOrder
        : (existing?.sortOrder ?? 1),
    timeline,
  };
}

export async function GET(): Promise<NextResponse<Leader[]>> {
  const leaders = sortLeaders(await readLeaders());
  return NextResponse.json(leaders);
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
