import { NextRequest, NextResponse } from "next/server";
import type { Leader, LeaderInput } from "@/types";

const MOCK_LEADERS: Leader[] = [
  {
    id: "leader-to-lam",
    name: "Đại tướng Tô Lâm",
    position: "Ủy viên Bộ Chính trị, Bí thư Trung ương Đảng",
    portraitUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=520&fit=crop&crop=face",
    biography:
      "Đồng chí Tô Lâm sinh năm 1957, quê quán tỉnh Hưng Yên. Trải qua nhiều vị trí lãnh đạo trong lực lượng Công an nhân dân, góp phần xây dựng lực lượng Công an cách mạng, chính quy, tinh nhuệ, từng bước hiện đại, góp phần giữ vững an ninh quốc gia, bảo đảm trật tự, an toàn xã hội và phục vụ công tác xây dựng, bảo vệ Tổ quốc.",
    tier: "top",
    timeline: [
      {
        year: "1974",
        event: "Gia nhập lực lượng Công an",
        description:
          "Bắt đầu sự nghiệp trong ngành Công an, được đào tạo nền tảng về nghiệp vụ an ninh và xây dựng phong cách người chiến sĩ Công an nhân dân.",
      },
      {
        year: "2010",
        event: "Giữ chức vụ lãnh đạo cấp cao Bộ Công an",
        description:
          "Đảm nhận các trọng trách lãnh đạo, chỉ đạo công tác đảm bảo an ninh quốc gia, trật tự an toàn xã hội trên phạm vi toàn quốc.",
      },
      {
        year: "2024",
        event: "Được phong cấp Đại tướng",
        description:
          "Được Quốc hội phê chuẩn giữ chức vụ Chủ tịch nước Cộng hòa xã hội chủ nghĩa Việt Nam, tiếp tục cống hiến cho sự nghiệp xây dựng và bảo vệ Tổ quốc.",
      },
    ],
  },
  {
    id: "leader-bui-thien-ngo",
    name: "Thượng tướng Bùi Thiện Ngộ",
    position: "Thứ trưởng Bộ Công an",
    portraitUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=520&fit=crop&crop=face",
    biography:
      "Đồng chí Bùi Thiện Ngộ sinh năm 1961, có nhiều năm công tác trong lực lượng Công an nhân dân. Luôn gương mẫu, trách nhiệm cao trong công tác xây dựng Đảng, xây dựng lực lượng; góp phần thực hiện hiệu quả các chủ trương của Đảng, Nhà nước về bảo đảm an ninh, trật tự và phục vụ nhân dân.",
    tier: "top",
    timeline: [
      {
        year: "1983",
        event: "Vào ngành Công an",
        description:
          "Bắt đầu công tác tại địa phương, trực tiếp tham gia công tác đảm bảo an ninh trật tự ở cơ sở.",
      },
      {
        year: "2015",
        event: "Đảm nhiệm chức vụ Tổng cục trưởng",
        description:
          "Lãnh đạo, chỉ đạo các mặt công tác chuyên môn, góp phần nâng cao hiệu quả đấu tranh phòng chống tội phạm.",
      },
      {
        year: "2020",
        event: "Được phong cấp Thượng tướng",
        description:
          "Tiếp tục giữ trọng trách Thứ trưởng Bộ Công an, tham gia chỉ đạo các lĩnh vực then chốt của ngành.",
      },
    ],
  },
  {
    id: "leader-le-minh-huong",
    name: "Thượng tướng Lê Minh Hương",
    position: "Thứ trưởng Bộ Công an",
    portraitUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=520&fit=crop&crop=face",
    biography:
      "Đồng chí Lê Minh Hương sinh năm 1960, có bề dày kinh nghiệm trong công tác an ninh, trật tự. Luôn bám sát chủ trương của Đảng, chính sách, pháp luật của Nhà nước; góp phần xây dựng lực lượng Công an vững mạnh, gần gũi và phục vụ nhân dân.",
    tier: "bottom",
    timeline: [
      {
        year: "1982",
        event: "Công tác tại Công an địa phương",
        description:
          "Trực tiếp tham gia công tác bảo vệ an ninh trật tự, xây dựng mô hình an ninh cơ sở tại các địa phương.",
      },
      {
        year: "2012",
        event: "Giữ chức vụ lãnh đạo Tổng cục",
        description:
          "Chỉ đạo công tác chuyên môn, đổi mới phương thức hoạt động, ứng dụng công nghệ trong quản lý nhà nước về an ninh trật tự.",
      },
      {
        year: "2019",
        event: "Phong cấp Thượng tướng",
        description:
          "Được giao trọng trách Thứ trưởng Bộ Công an, tham gia chỉ đạo, điều hành các mặt công tác của ngành.",
      },
    ],
  },
];

let leadersStore: Leader[] = [...MOCK_LEADERS];

function isValidLeaderInput(body: unknown): body is LeaderInput {
  if (!body || typeof body !== "object") return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.position === "string" &&
    typeof candidate.portraitUrl === "string" &&
    typeof candidate.biography === "string" &&
    (candidate.tier === "top" || candidate.tier === "bottom") &&
    Array.isArray(candidate.timeline)
  );
}

function normalizeLeader(input: LeaderInput, existingId?: string): Leader {
  const id =
    (typeof input.id === "string" && input.id.trim()) ||
    existingId ||
    `leader-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const timeline = input.timeline.map((item) => ({
    year: String(item.year).trim(),
    event: String(item.event).trim(),
    description: String(item.description).trim(),
  }));

  return {
    id,
    name: input.name.trim(),
    position: input.position.trim(),
    portraitUrl: input.portraitUrl.trim(),
    biography: input.biography.trim(),
    tier: input.tier,
    timeline,
  };
}

export async function GET(): Promise<NextResponse<Leader[]>> {
  const sorted = [...leadersStore].sort((a, b) => {
    if (a.tier === b.tier) return a.name.localeCompare(b.name, "vi");
    return a.tier === "top" ? -1 : 1;
  });
  return NextResponse.json(sorted);
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
    const existingIndex = payload.id
      ? leadersStore.findIndex((l) => l.id === payload.id)
      : -1;

    const leader = normalizeLeader(
      payload,
      existingIndex >= 0 ? leadersStore[existingIndex].id : undefined
    );

    if (existingIndex >= 0) {
      leadersStore[existingIndex] = leader;
    } else {
      const duplicateId = leadersStore.some((l) => l.id === leader.id);
      if (duplicateId) {
        return NextResponse.json(
          { error: "ID đã tồn tại. Vui lòng chọn ID khác." },
          { status: 409 }
        );
      }
      leadersStore.push(leader);
    }

    return NextResponse.json(leader, { status: existingIndex >= 0 ? 200 : 201 });
  } catch {
    return NextResponse.json(
      { error: "Không thể xử lý yêu cầu." },
      { status: 500 }
    );
  }
}
