/**
 * Mock data for the Collaboration Panel.
 * Channels are per-project + a "direct messages" bucket.
 * Messages reference BOM items via `anchor: { type: "bom-item", id }`
 * so clicking an anchor chip can later deep-link into the workspace.
 */

export const COLLAB_USERS = {
  me: { id: "me", name: "나", role: "Design Engineer", color: "#532DF6" },
  doyoon: { id: "doyoon", name: "김도윤", role: "Design Engineer", color: "#1565E0" },
  jieun: { id: "jieun", name: "박지은", role: "Cost Manager", color: "#E06900" },
  hyunsu: { id: "hyunsu", name: "이현수", role: "Sourcing Manager", color: "#009955" },
  mikyung: { id: "mikyung", name: "최미경", role: "Quality Manager", color: "#7E22CE" },
  suho: { id: "suho", name: "정수호", role: "Project Manager", color: "#B91C1C" },
  lg: { id: "lg", name: "LG Energy Sol.", role: "Supplier · Ext.", color: "#4B5565", isExternal: true },
};

export const COLLAB_CHANNELS = [
  {
    id: "general",
    name: "general",
    description: "프로젝트 전반 공지",
    unread: 0,
  },
  {
    id: "design",
    name: "design",
    description: "설계 변경 · 스펙 · Feasibility",
    unread: 3,
  },
  {
    id: "cost",
    name: "cost",
    description: "Target / Should Cost · 견적",
    unread: 1,
  },
  {
    id: "sourcing",
    name: "sourcing",
    description: "공급사 · RFx · 계약",
    unread: 0,
  },
  {
    id: "quality",
    name: "quality",
    description: "APQP · PPAP · 4M",
    unread: 2,
  },
];

export const COLLAB_MESSAGES = {
  general: [
    {
      id: "g1",
      userId: "suho",
      time: "09:02",
      text: "Dev Phase Gate Review 금요일 10시입니다. 각 모듈 리드는 상태 업데이트 부탁드려요.",
    },
    {
      id: "g2",
      userId: "doyoon",
      time: "09:15",
      text: "BOM v1.2 배포했습니다. Cooling Plate 추가 반영됐으니 Sourcing/Quality 채널 참고해주세요.",
    },
  ],
  design: [
    {
      id: "d1",
      userId: "doyoon",
      time: "어제 17:22",
      text: "A-113 Cooling Plate를 v1.2에서 새로 추가했습니다. 발열 시뮬레이션 재확인 후 스펙 올렸습니다.",
      anchor: { type: "bom-item", id: "A-113", label: "A-113 Cooling Plate" },
    },
    {
      id: "d2",
      userId: "mikyung",
      time: "어제 18:04",
      text: "해당 공급사는 PPAP 이력 없음 — Pre-PPAP 평가 필요합니다.",
      anchor: { type: "bom-item", id: "A-113", label: "A-113 Cooling Plate" },
      thread: 4,
    },
    {
      id: "d3",
      userId: "jieun",
      time: "08:40",
      text: "@doyoon BMS Controller Board 공급사 변경건, 원가 영향 정리 붙였어요. 리뷰 부탁드립니다.",
      anchor: { type: "bom-item", id: "A-121", label: "A-121 BMS Controller Board" },
      mentions: ["doyoon"],
    },
  ],
  cost: [
    {
      id: "c1",
      userId: "jieun",
      time: "08:32",
      text: "Current BOM 총원가가 Target 대비 ₩250k 초과입니다. BMS / Cooling Plate 두 건이 주 원인이라 해당 라인 집중 협상 필요.",
      anchor: { type: "bom-item", id: "A-120", label: "A-120 BMS" },
    },
    {
      id: "c2",
      userId: "hyunsu",
      time: "08:45",
      text: "Mobis 재견적 요청 보냈습니다. 목표가 대비 -6% 포지션 잡고 협상 들어갑니다.",
    },
  ],
  sourcing: [
    {
      id: "s1",
      userId: "hyunsu",
      time: "화 15:12",
      text: "POSCO Steel Top/Bottom Housing 1차 견적 수령. 비교표 Sourcing Workspace에 올렸습니다.",
    },
  ],
  quality: [
    {
      id: "q1",
      userId: "mikyung",
      time: "어제 11:20",
      text: "Prismatic Cell PPAP 승인됨. 다음 주 Cooling Plate Pre-PPAP 일정 확정 후 공유드립니다.",
      anchor: { type: "bom-item", id: "A-111", label: "A-111 Prismatic Cell" },
    },
    {
      id: "q2",
      userId: "lg",
      time: "09:58",
      text: "요청하신 4M 변경 내역 문서 업로드 완료했습니다. 검토 부탁드립니다.",
    },
  ],
};

export const TOTAL_UNREAD = COLLAB_CHANNELS.reduce(
  (s, c) => s + (c.unread ?? 0),
  0,
);
