# Screen Inventory — SRM Design-to-Source

> 상태 범례: 🔴 미시작 / 🟡 기획중 / 🟢 완료
> 우선순위: P1 (핵심) / P2 (중요) / P3 (추후)

---

## 1. Project List

| # | 화면명 | 설명 | 페르소나 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| 1-1 | Project List | 전체 NPI 프로젝트 목록, 상태/필터/검색 | All | P1 | 🔴 |
| 1-2 | Create New Project | 신규 프로젝트 생성 (제품유형, 일정, 팀 설정) | PM | P1 | 🔴 |

---

## 2. Project Details (Workplace)

> BOM 중심으로 모든 Collaboration이 연결되는 메인 허브 화면

| # | 화면명 | 설명 | 페르소나 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| 2-1 | Project Workplace | 프로젝트 개요, Phase 현황, 모듈 진입점 통합 | All | P1 | 🔴 |
| 2-2 | BOM Workspace | BOM 트리 + View 전환 (E-BOM / Sourcing / Q-BOM) | DE, CM, SM | P1 | 🔴 |
| 2-3 | BOM Version 비교 | 버전 간 변경사항 Delta 비교 | DE, CM | P1 | 🔴 |
| 2-4 | Item 360 | 품목 상세 — 스펙 / 원가 / 소싱 / 품질 통합뷰 | All | P1 | 🔴 |
| 2-5 | Design Change 요청 | 설계 변경 요청 + BOM/Cost/Timeline 영향도 분석 | DE | P1 | 🔴 |

---

## 3. Cost Collaboration

> Should Cost 분석 + 견적 비교 + 원가 Delta 추적

| # | 화면명 | 설명 | 페르소나 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| 3-1 | Cost Workspace | BOM 연동 원가 분석 메인, Item별 Target / Should Cost | CM | P1 | 🔴 |
| 3-2 | Should Cost 입력 | Item별 Clean sheet / 목표 원가 입력 | CM | P1 | 🔴 |
| 3-3 | Cost vs 견적 비교 | Should Cost vs 실제 견적 비교표 | CM, SM | P1 | 🔴 |
| 3-4 | Cost Delta 추적 | 설계 버전 간 원가 변화 추적 (before vs after) | CM, PM | P1 | 🔴 |
| 3-5 | 가격 벤치마크 | 시장가 / 과거가 / Carry-over / SR 견적 비교 | CM | P2 | 🔴 |

---

## 4. Design Collaboration

> BOM 기반 설계-소싱-원가 협업, 공급사 Feasibility 포함

| # | 화면명 | 설명 | 페르소나 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| 4-1 | Design Workspace | 설계 협업 메인 — BOM + 스펙 + 변경 이력 | DE, SM, CM | P1 | 🔴 |
| 4-2 | Spec 정의 / 편집 | Item 스펙 입력, 카테고리 분류 | DE | P1 | 🔴 |
| 4-3 | 유사 부품 탐색 | Spec 기반 유사 Item 검색 + 후보 부품 비교 | DE, CM | P2 | 🔴 |
| 4-4 | 공급사 Feasibility 체크 | 설계 단계 공급사 제조 가능성 확인 | DE, SM | P2 | 🔴 |
| 4-5 | RFx 발행 | RFI/RFP/RFQ 작성, 공급사 지정, 마감일 설정 | SM | P1 | 🔴 |
| 4-6 | 견적 비교표 | 공급사별 견적 자동 비교 + 선정 근거 기록 | SM, CM | P1 | 🔴 |

---

## 5. Quality (APQP) Collaboration

> APQP 거버넌스 + PPAP 관리 + S-BOM & Q-BOM Sync

| # | 화면명 | 설명 | 페르소나 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| 5-1 | APQP Workspace | 품질 협업 메인 — 마일스톤, PPAP 현황, 리스크 | QM | P1 | 🔴 |
| 5-2 | PPAP 관리 | PPAP 항목별 제출 / 검토 / 승인 | QM | P1 | 🔴 |
| 5-3 | Q-BOM 연동 뷰 | S-BOM ↔ Q-BOM Sync 상태 + 불일치 알림 | QM, SM | P1 | 🔴 |
| 5-4 | 4M 변경 요청 | Man/Machine/Material/Method 변경 관리 | QM | P2 | 🔴 |
| 5-5 | 불량 이력 연계 | 과거 불량 데이터 연결 및 예방 가이드 | QM | P2 | 🔴 |

---

## 6. Collaboration Panel (공통 UI 컴포넌트)

> 모든 Collaboration 화면(Cost / Design / Quality) 내에 공통으로 삽입되는
> Slack형 실시간 협업 패널

| # | 화면명 | 설명 | 페르소나 | 우선순위 | 상태 |
|---|---|---|---|---|---|
| 6-1 | Collaboration Panel — 채널 목록 | 프로젝트 내 채널 목록 (General, Cost, Design, Quality 등) | All | P1 | 🔴 |
| 6-2 | Collaboration Panel — 메시지 스레드 | 채널 내 메시지, 스레드, 멘션(@), 이모지 리액션 | All | P1 | 🔴 |
| 6-3 | Collaboration Panel — BOM/Item 연결 | 메시지에서 BOM Item, 코멘트, 의사결정 링크 | All | P1 | 🔴 |
| 6-4 | Collaboration Panel — 파일 공유 | 문서 첨부, 버전 관리, 미리보기 | All | P2 | 🔴 |
| 6-5 | Collaboration Panel — 알림 / 멘션 | @멘션, 태스크 할당, 마감일 알림 | All | P2 | 🔴 |

---

## 화면 수 요약

| 모듈 | 화면 수 |
|---|---|
| 1. Project List | 2개 |
| 2. Project Workplace | 5개 |
| 3. Cost Collaboration | 5개 |
| 4. Design Collaboration | 6개 |
| 5. Quality Collaboration | 5개 |
| 6. Collaboration Panel (공통) | 5개 |
| **Total** | **28개** |

---

## 페르소나 약어
- **PM**: Project Manager
- **DE**: Design Engineer
- **CM**: Cost Manager
- **SM**: Sourcing Manager
- **QM**: Quality Manager
- **Supplier**: 외부 공급사 담당자
