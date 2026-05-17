import { NextResponse } from "next/server";
import { resetLeadersToSample, sortLeaders } from "@/lib/leaders-store";

/** POST — khôi phục 13 lãnh đạo mẫu (yêu cầu đăng nhập admin) */
export async function POST(): Promise<NextResponse> {
  try {
    const leaders = sortLeaders(await resetLeadersToSample());
    return NextResponse.json({ success: true, count: leaders.length, leaders });
  } catch {
    return NextResponse.json(
      { error: "Không thể nạp dữ liệu mẫu." },
      { status: 500 }
    );
  }
}
