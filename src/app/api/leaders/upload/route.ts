import { NextRequest, NextResponse } from "next/server";
import {
  savePortraitFile,
} from "@/lib/leaders-store";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const leaderId = formData.get("leaderId");
    const targetInput = formData.get("target");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Không có file ảnh." },
        { status: 400 }
      );
    }

    const id =
      (typeof leaderId === "string" && leaderId.trim()) ||
      `leader-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const target =
      targetInput === "popup" ||
      (typeof leaderId === "string" && /popup/i.test(leaderId))
        ? "popup"
        : "home";

    const url = await savePortraitFile(file, id, target);

    return NextResponse.json({ url, leaderId: id, target });
  } catch (err) {
    console.error("Portrait upload failed", err);
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
