# BOM 중심 통합 협업 구조 — Product & Project Definition

> 핵심 목표: BOM을 중심으로 Design–Cost–Sourcing–Quality를 연결하는 통합 협업 구조 설계

---

## 1. NPI 케이스에 따른 시스템 Flexibility

### 제품 유형 (4가지)
- Minor Enhancement
- Major Enhancement
- New To The Company
- New To The World

### 프로젝트 흐름
```
Marketing/Planning → Incubation → Concept → Plan → Dev (Bottleneck) → SOP → Sustain → EOP
                     |←—————————————— Design Collaboration ——————————————→|
                                                   ↑
                                            Design Freeze (Spec 확정)
```

### 핵심 이벤트: SOP 전에 의사결정이 끝나야 하는 것

**① Make or Buy 의사결정**
- End Item (구매관점에서 사오는 것) 정의
- Leaf node부터 살지 / Level 2부터 살지 결정
- 회사의 노하우에 따라 Outsourcing / 조립 / 생산 레벨 등의 의사결정

**② PPAP**
- Supplier의 Parts에 대한 Quality Assurance
- 해당 Supplier의 납품 퀄리티 확보
- → Dev 단계가 주요 Bottleneck인 이유

### Design Change (양산 이후 발생 케이스)
요청 → 결재/승인 강화
1. QA: 4M 변경 요청 (Man, Machine, Material, Method)
2. Supplier: 양산성 떨어지는 경우
3. Cost: TMC 못 맞추는 경우
4. 생산 이슈

---

## 2. Item의 개념 재정립

> Lv3를 샀으면, 거기까지만 Item이며 그 하위 노드는 Supplier의 Item

- **Item = Master Data**
- **Transaction = 생성 데이터**
- 물리적 부품만이 아니라 서비스 / 인력 / 용역 포함

### Item 유형

**1. Commodities**
- 1-1. 사오는 단위 (UOM 기반)
- 1-2. Component: Commodity를 바로 살 수 있도록 가공해놓은 것 → PPAP의 대상이 되기도 함

**2. Design To Purchase**
- 2-1. Mechanical
- 2-2. Electronic

**3. Construction (공정)**

**4. Service (용역)**

---

## 3. Cost 구조 (CE = Supplier의 Total Cost 분석)

### Buyer vs Supplier 관점 비교

| 구분 | Buyer Target Cost | Supplier Target Cost |
|---|---|---|
| **직접원가** | 재료비 (Cost Manager 의사결정) | 재료비 (Cost Manager 의사결정) |
| | 노무비 | 노무비 |
| | Direct Manufacturing Overhead | Direct Manufacturing Overhead |
| **간접원가** | G&A (General & Administrative) | G&A (General & Administrative) |
| | Indirect Factory | Indirect Factory |
| | Others | Others |
| **최상위** | CFO가 Profit 의사결정 | — |

- **CE**: Cost Manager가 Breakdown 분석 → AVAP하고자 함
- Buyer는 End Item 기준 직접원가(재료비) 중심
- Supplier는 직접원가 + 간접원가 전체 포함
- → **Cost Negotiation 필수 발생**

### 가격 판단 근거 (복수 비교)
- Internal 기준 단가
- Carry-over 단가
- 시장가 (Market Price)
- SR/RFx를 통한 신규 견적
- Should-cost / Clean sheet 분석값

### 품목 유형별 접근 방식
- **Commodity성 자재**: 시장가, 과거 가격, 내부 DB 중심
- **Custom Part (기구물, 전장품, 주문제작)**: Should-cost / Clean sheet 분석 중심

---

## 4. Persona별로 다르게 보는 BOM의 형태

```
BOM
 ├── 1. Part List
 │     Incubation 단계: 복잡한 트리 구조가 아닌 대략의 파트 리스트 구성
 │     APQP 프로젝트는 파트 리스트여도 됨
 │
 ├── 2. E-BOM (Engineering BOM)
 │     Network 모델 (Tree Grid)
 │     = 각 모듈별로 파트를 따로 두고 Hierarchy를 보는 것
 │
 └── 3. Flattened BOM
       ├── 3-1. Sourcing BOM
       │     End Item (구매레벨)의 하위 레벨은 없는 것으로 계산
       │
       └── 3-2. Q-BOM  ←—— Sync ——→ Sourcing BOM
             Extended PPAP Processing 대상
             = Item × Supplier
```

### BOM 종류 요약

| 유형 | 목적 | 특징 |
|---|---|---|
| Part List | 초기 파트 구성 | Incubation 단계, 트리 불필요 |
| E-BOM | 설계 | Network 모델, Tree Grid |
| Sourcing BOM | 구매 | Flattened, End Item 기준 수량 재계산 |
| Q-BOM | 품질 | Item × Supplier, PPAP 대상 |

> **핵심**: BOM은 하나가 아니라 목적별 View — Flattening 시 End Item 기준으로 수량 재계산 (예: 나사 12개 → 8개)

---

## 5. APQP & Quality 구조

**TQM = APQP + Manufacturing Quality + Market Quality (+ 4M / 8D)**

- **APQP**: 양산 전 품질 프로세스 (프로젝트 단위) — 시스템 구현(표준화) 어려움
- **PPAP**: APQP 내부 액티비티
- **4M / 8D**: 문제해결 프로세스

### APQP Quality Flow (3가지 케이스)

| 케이스 | 조건 | 흐름 |
|---|---|---|
| Case 1 | 기존 파트 + 기존 Supplier | PPAP만 진행 |
| Case 2 | 기존 파트 + 신규 Supplier | APQP에서 Sourcing Request 발송 → PPAP |
| Case 3 | 신규 파트 | S-BOM + Q-BOM Parallel 진행 (SR 필요) |

> 목표: **S-BOM과 Q-BOM이 Parallel하게 진행**되도록 하는 것

---

## 6. 협업 구조

### 현재 문제
- S-BOM / Q-BOM / Cost / Sourcing 분리
- 데이터 Sync 없음

### 목표 구조: 양방향 Sync
```
Sourcing BOM ↔ Q-BOM ↔ Cost ↔ Sourcing
```
공유 상태:
- PPAP 진행 상태
- Supplier 상태
- Cost 상태

---

## 7. SR / PR / BPA 구분

| 유형 | 목적 | 결과 |
|---|---|---|
| **SR (Sourcing Request)** | 업체 탐색 + 가격 확인 | 공급사 선정 또는 견적 확보 |
| **PR (Purchase Request)** | 실제 구매 요청 | PO 발행 → 납품 → 입고 → 정산 |
| **BPA Request** | 반복 구매용 단가 계약 선체결 | 계약 체결 (이후 PR/PO 바로 가능) |

---

## 8. Buy Mode 유형

| 유형 | 설명 |
|---|---|
| **AVAP** | 구매사가 리스트/가이드 제공, Supplier가 구매 |
| **Buy & Sell** | 구매사가 먼저 구매 후 Supplier에 공급 |
| **ODM** | 제품 전체를 외부에서 통째로 구매 |
| **직접 구매** | 구매사가 직접 End Item 구매 |

---

## 9. 핵심 Insights

> **Insight 1 — "End Item = 시스템의 기준점"**
> BOM 구조 / Cost 계산 / Quality 대상 / Sourcing 범위 — 모든 것이 여기서 결정됨

> **Insight 2 — "BOM은 데이터가 아니라 View다"**
> Part List / E-BOM / Sourcing BOM / Q-BOM — 같은 데이터, 목적별 다른 View

> **Insight 3 — "같은 데이터, 다른 의미"**
> Buyer → 비용 / Supplier → 제품 / Quality → 검증 대상 / Engineer → 구조

> **Insight 4 — "Quality는 Gate다"**
> PPAP 미완료 → 발주 불가 → 양산 불가

> **Insight 5 — "진짜 문제는 기능이 아니라 구조"**
> 해결책: Single Source + Multi View + Sync 구조

---

## 10. 핵심 화면 액션 아이템

### 핵심 화면
- End Item 결정 화면 (Make vs Buy)
- BOM View 전환 UI (Part List / E-BOM / Sourcing BOM / Q-BOM)
- PPAP 상태 관리 화면
- Design Change 요청 및 결재 화면

### 데이터 모델
- Item + Supplier + Quality Status → 하나의 객체로 통합

### 협업 UX
- 양방향 Sync (S-BOM ↔ Q-BOM)
- 상태 기반 UI (진행 / 완료 / 차단)

### Flow 설계
- Design → Cost → Sourcing → Quality → 하나의 연결된 Journey
