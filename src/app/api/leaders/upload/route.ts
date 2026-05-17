import { NextRequest, NextResponse } from "next/server";
import {
  deletePortraitFileIfLocal,
  getLeaderById,
  isLocalPortraitUrl,
  savePortraitFile,
  upsertLeader,
} from "@/lib/leaders-store";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const leaderId = formData.get("leaderId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Không có file ảnh." },
        { status: 400 }
      );
    }

    const id =
      (typeof leaderId === "string" && leaderId.trim()) ||
      `leader-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const existing = await getLeaderById(id);
    if (existing?.portraitUrl && isLocalPortraitUrl(existing.portraitUrl)) {
      await deletePortraitFileIfLocal(existing.portraitUrl);
    }

    const url = await savePortraitFile(file, id);

    if (existing) {
      await upsertLeader({ ...existing, portraitUrl: url });
    }

    return NextResponse.json({ url, leaderId: id });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "INVALID_TYPE") {
        return NextResponse.json(
          { error: "Chỉ chấp nhận ảnh JPEG, PNG, WebP hoặc GIF." },
          { status: 400 }
        );
      }
      if (err.message === "FILE_TOO_LARGE") {
        return NextResponse.json(
          { error: "Ảnh tối đa 5MB." },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { error: "Không thể tải ảnh lên." },
      { status: 500 }
    );
  }
}
