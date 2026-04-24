/**
 * Mock data for the Collaboration Panel.
 * Channels are per-project + a "direct messages" bucket.
 * Messages reference BOM items via `anchor: { type: "bom-item", id }`
 * so clicking an anchor chip can later deep-link into the workspace.
 */

export const COLLAB_USERS = {
  me: { id: "me", name: "Me", role: "Design Engineer", color: "#532DF6" },
  doyoon: { id: "doyoon", name: "Doyoon Kim", role: "Design Engineer", color: "#1565E0" },
  jieun: { id: "jieun", name: "Jieun Park", role: "Cost Manager", color: "#E06900" },
  hyunsu: { id: "hyunsu", name: "Hyunsu Lee", role: "Sourcing Manager", color: "#009955" },
  mikyung: { id: "mikyung", name: "Mikyung Choi", role: "Quality Manager", color: "#7E22CE" },
  suho: { id: "suho", name: "Suho Jung", role: "Project Manager", color: "#B91C1C" },
  lg: { id: "lg", name: "LG Energy Sol.", role: "Supplier · Ext.", color: "#4B5565", isExternal: true },
};

export const COLLAB_CHANNELS = [
  {
    id: "general",
    name: "general",
    description: "Project-wide announcements",
    unread: 0,
  },
  {
    id: "design",
    name: "design",
    description: "Design changes · Specs · Feasibility",
    unread: 3,
  },
  {
    id: "cost",
    name: "cost",
    description: "Target / Should Cost · Quotes",
    unread: 1,
  },
  {
    id: "sourcing",
    name: "sourcing",
    description: "Suppliers · RFx · Contracts",
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
      text: "Dev Phase Gate Review is Friday 10:00. Module leads, please post status updates.",
    },
    {
      id: "g2",
      userId: "doyoon",
      time: "09:15",
      text: "BOM v1.2 is out. Cooling Plate is newly added — check the Sourcing and Quality channels for details.",
    },
  ],
  design: [
    {
      id: "d1",
      userId: "doyoon",
      time: "Yesterday 17:22",
      text: "Added A-113 Cooling Plate in v1.2. Spec uploaded after re-running the thermal simulation.",
      anchor: { type: "bom-item", id: "A-113", label: "A-113 Cooling Plate" },
    },
    {
      id: "d2",
      userId: "mikyung",
      time: "Yesterday 18:04",
      text: "No PPAP history for this supplier — Pre-PPAP assessment required.",
      anchor: { type: "bom-item", id: "A-113", label: "A-113 Cooling Plate" },
      thread: 4,
    },
    {
      id: "d3",
      userId: "jieun",
      time: "08:40",
      text: "@doyoon Posted the cost impact summary for the BMS Controller Board supplier change. Please review.",
      anchor: { type: "bom-item", id: "A-121", label: "A-121 BMS Controller Board" },
      mentions: ["doyoon"],
    },
  ],
  cost: [
    {
      id: "c1",
      userId: "jieun",
      time: "08:32",
      text: "Current BOM total is ₩250k over target. BMS and Cooling Plate are the main drivers — focus negotiation on those lines.",
      anchor: { type: "bom-item", id: "A-120", label: "A-120 BMS" },
    },
    {
      id: "c2",
      userId: "hyunsu",
      time: "08:45",
      text: "Sent a requote request to Mobis. Going in with a -6% position against target.",
    },
  ],
  sourcing: [
    {
      id: "s1",
      userId: "hyunsu",
      time: "Tue 15:12",
      text: "Received POSCO Steel's first quote for the Top/Bottom Housing. Comparison table is up in the Sourcing Workspace.",
    },
  ],
  quality: [
    {
      id: "q1",
      userId: "mikyung",
      time: "Yesterday 11:20",
      text: "Prismatic Cell PPAP approved. Will share next week once the Cooling Plate Pre-PPAP schedule is set.",
      anchor: { type: "bom-item", id: "A-111", label: "A-111 Prismatic Cell" },
    },
    {
      id: "q2",
      userId: "lg",
      time: "09:58",
      text: "Uploaded the requested 4M change documents. Please review.",
    },
  ],
};

export const TOTAL_UNREAD = COLLAB_CHANNELS.reduce(
  (s, c) => s + (c.unread ?? 0),
  0,
);
