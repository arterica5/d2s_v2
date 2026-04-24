/**
 * Mock NPI projects used by the Project List page.
 * Matches the phase model documented in
 * docs/03_bom-product-definition.md:
 *   Incubation → Concept → Plan → Dev → SOP → Sustain → EOP
 */

export const PHASES = [
  { id: "incubation", label: "Incubation", short: "Inc" },
  { id: "concept", label: "Concept", short: "Con" },
  { id: "plan", label: "Plan", short: "Plan" },
  { id: "dev", label: "Dev", short: "Dev" },
  { id: "sop", label: "SOP", short: "SOP" },
  { id: "sustain", label: "Sustain", short: "Sus" },
  { id: "eop", label: "EOP", short: "EOP" },
];

export const PROJECT_TYPES = [
  { id: "minor", label: "Minor Enhancement", color: "var(--color-info-main)" },
  { id: "major", label: "Major Enhancement", color: "var(--color-primary-main)" },
  { id: "ntc", label: "New to Company", color: "var(--color-warning-main)" },
  { id: "ntw", label: "New to World", color: "var(--color-error-main)" },
];

export const RISK_LEVELS = {
  ontrack: { label: "On Track", color: "var(--color-success-main)" },
  atrisk: { label: "At Risk", color: "var(--color-warning-main)" },
  blocked: { label: "Blocked", color: "var(--color-error-main)" },
};

export const PROJECTS = [
  {
    id: "ev-model-x",
    code: "EV-MX-001",
    name: "EV Model X",
    description: "Next-gen BEV platform · 77 kWh pack",
    type: "ntc",
    phase: "dev",
    phaseProgress: 0.55,
    owner: { name: "Suho Jung", role: "PM", color: "#B91C1C" },
    members: [
      { name: "Doyoon Kim", color: "#1565E0" },
      { name: "Jieun Park", color: "#E06900" },
      { name: "Hyunsu Lee", color: "#009955" },
      { name: "Mikyung Choi", color: "#7E22CE" },
    ],
    startDate: "2025-11-04",
    sopDate: "2026-10-31",
    targetCost: 18_900_000,
    currentCost: 19_150_000,
    designReadiness: 0.68,
    ppapCompletion: 0.42,
    risk: "atrisk",
    lastActivity: "2h ago",
    itemCount: 214,
    openChanges: 6,
  },
  {
    id: "battery-pack-mk2",
    code: "BP-MK2",
    name: "Battery Pack Mk2",
    description: "High-density 800V pack · LFP chemistry",
    type: "major",
    phase: "plan",
    phaseProgress: 0.3,
    owner: { name: "Hana Baek", role: "PM", color: "#1246CC" },
    members: [
      { name: "Doyoon Kim", color: "#1565E0" },
      { name: "Jieun Park", color: "#E06900" },
    ],
    startDate: "2026-01-15",
    sopDate: "2027-02-28",
    targetCost: 6_200_000,
    currentCost: 6_080_000,
    designReadiness: 0.34,
    ppapCompletion: 0.08,
    risk: "ontrack",
    lastActivity: "1d ago",
    itemCount: 118,
    openChanges: 2,
  },
  {
    id: "motor-v3",
    code: "MOT-V3",
    name: "Motor Assembly V3",
    description: "Rear-drive PMSM · 220 kW",
    type: "minor",
    phase: "dev",
    phaseProgress: 0.82,
    owner: { name: "Joon Seo", role: "PM", color: "#006B3C" },
    members: [
      { name: "Doyoon Kim", color: "#1565E0" },
      { name: "Mikyung Choi", color: "#7E22CE" },
    ],
    startDate: "2025-06-01",
    sopDate: "2026-06-15",
    targetCost: 2_400_000,
    currentCost: 2_310_000,
    designReadiness: 0.92,
    ppapCompletion: 0.78,
    risk: "ontrack",
    lastActivity: "5h ago",
    itemCount: 87,
    openChanges: 1,
  },
  {
    id: "charger-pro",
    code: "CHG-PRO",
    name: "Charger Station Pro",
    description: "350 kW fast charger · outdoor",
    type: "ntc",
    phase: "concept",
    phaseProgress: 0.4,
    owner: { name: "Miri Yoon", role: "PM", color: "#E06900" },
    members: [
      { name: "Hyunsu Lee", color: "#009955" },
    ],
    startDate: "2026-03-10",
    sopDate: "2027-09-30",
    targetCost: 12_500_000,
    currentCost: null,
    designReadiness: 0.15,
    ppapCompletion: 0,
    risk: "ontrack",
    lastActivity: "3d ago",
    itemCount: 42,
    openChanges: 0,
  },
  {
    id: "hvac-2026",
    code: "HVAC-26",
    name: "HVAC Module 2026",
    description: "Heat-pump HVAC · reduced refrigerant",
    type: "major",
    phase: "dev",
    phaseProgress: 0.6,
    owner: { name: "Jae Han", role: "PM", color: "#7E22CE" },
    members: [
      { name: "Doyoon Kim", color: "#1565E0" },
      { name: "Jieun Park", color: "#E06900" },
      { name: "Mikyung Choi", color: "#7E22CE" },
    ],
    startDate: "2025-09-01",
    sopDate: "2026-08-31",
    targetCost: 890_000,
    currentCost: 1_020_000,
    designReadiness: 0.71,
    ppapCompletion: 0.33,
    risk: "blocked",
    lastActivity: "4h ago",
    itemCount: 64,
    openChanges: 9,
  },
  {
    id: "wheel-motor",
    code: "WM-CMP",
    name: "Wheel Motor Compact",
    description: "In-wheel motor · 80 kW · steer-by-wire ready",
    type: "minor",
    phase: "sop",
    phaseProgress: 0.15,
    owner: { name: "Eunji Kang", role: "PM", color: "#1565E0" },
    members: [
      { name: "Mikyung Choi", color: "#7E22CE" },
      { name: "Hyunsu Lee", color: "#009955" },
    ],
    startDate: "2025-01-20",
    sopDate: "2026-04-01",
    targetCost: 1_600_000,
    currentCost: 1_580_000,
    designReadiness: 1,
    ppapCompletion: 0.96,
    risk: "ontrack",
    lastActivity: "1d ago",
    itemCount: 52,
    openChanges: 0,
  },
  {
    id: "adas-upgrade",
    code: "ADAS-UP",
    name: "ADAS Sensor Upgrade",
    description: "4D imaging radar + L2+ stack",
    type: "ntw",
    phase: "plan",
    phaseProgress: 0.7,
    owner: { name: "Soobin Moon", role: "PM", color: "#B34500" },
    members: [
      { name: "Doyoon Kim", color: "#1565E0" },
      { name: "Hyunsu Lee", color: "#009955" },
    ],
    startDate: "2026-02-01",
    sopDate: "2027-11-30",
    targetCost: 3_300_000,
    currentCost: 3_620_000,
    designReadiness: 0.42,
    ppapCompletion: 0.05,
    risk: "atrisk",
    lastActivity: "6h ago",
    itemCount: 96,
    openChanges: 4,
  },
  {
    id: "infotainment-v4",
    code: "IVI-V4",
    name: "Infotainment V4",
    description: "15.6\" display · ARM SoC · OTA",
    type: "minor",
    phase: "sustain",
    phaseProgress: 0.5,
    owner: { name: "Yoonseo Cha", role: "PM", color: "#333C48" },
    members: [
      { name: "Jieun Park", color: "#E06900" },
    ],
    startDate: "2024-05-01",
    sopDate: "2025-05-20",
    targetCost: 720_000,
    currentCost: 680_000,
    designReadiness: 1,
    ppapCompletion: 1,
    risk: "ontrack",
    lastActivity: "2d ago",
    itemCount: 38,
    openChanges: 1,
  },
];

export function summarize(projects) {
  const total = projects.length;
  const byRisk = projects.reduce(
    (acc, p) => {
      acc[p.risk] = (acc[p.risk] ?? 0) + 1;
      return acc;
    },
    { ontrack: 0, atrisk: 0, blocked: 0 },
  );
  const avgReadiness =
    projects.reduce((s, p) => s + (p.designReadiness ?? 0), 0) / total;
  const totalOpenChanges = projects.reduce(
    (s, p) => s + (p.openChanges ?? 0),
    0,
  );
  return { total, byRisk, avgReadiness, totalOpenChanges };
}
