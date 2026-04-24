# Category Strategy

---

## 1. Category Strategy 기본 구조

두 축으로 분석:
- **SI (Strategic Importance)**: 해당 품목/카테고리가 구매사 입장에서 얼마나 전략적으로 중요한지
- **RA (Relationship Attractiveness)**: 구매사와 공급시장/협력사 간 관계에서 어느 쪽 이익이 큰지

### SI 영역 (4개)
- Strategic
- Bottleneck
- Leverage
- Non-critical / Transactional

### RA 영역 (4개)
- Mutually beneficial
- Supplier benefit 중심
- Buyer benefit 중심
- 양측 benefit이 낮은 영역

→ 두 분석을 결합해 4×4 매트릭스 생성
→ 최종: **Strategic / Collaborative / Transactional** 상위 전략 그룹으로 단순화

---

## 2. Category Strategy와 Supplier Evaluation의 연결

카테고리 전략 + 협력사 정기평가(Performance Evaluation) 결과를 결합해 협력사 차별화 관리:
- Prime group
- Long-term relationship 대상
- 협업 강화 대상
- 대체 검토 대상

---

## 3. 실제 릴리즈 방향 (4월 기준)

복잡한 매트릭스 대신 단순한 4분면으로 제공:
- **구매사 파워 vs 공급사 파워** 기반 카테고리 포지셔닝
- 포지셔닝 결과에 따라 구매 전략 추천

---

## 4. Category Strategy의 목적: 구매 전략 추천

카테고리 전략 → 후속 구매 전략 추천의 기반

### 영역별 전략 예시
- RFQ 대신 RFP 사용
- 협력사 다변화
- 품질 템플릿 필수 적용
- 글로벌 소싱 / 로컬 소싱 선택
- 특정 절차 mandatory 적용

선택된 전략은 이후 프로세스에서:
- 가이드라인으로 작동하거나
- 시스템상 mandatory rule로 강제될 수 있음

---

## 5. 360 View 구조

| 뷰 | 역할 |
|---|---|
| **Item 360** | 품목 관점 통합 정보 |
| **Supplier 360** | 공급사 관점 통합 정보 |
| **Category 360** | 카테고리 관점 전략 대시보드 허브 |

→ Transaction 화면이 아닌 **전략/분석/가시화 중심 360 View**

---

## 6. Category Management와 D2S의 연결

**Category Management (상위 정책 레이어)**
↓
**D2S (실제 제품/부품/원가 단위 실행)**

D2S에서 수행되는 것:
- 프로젝트 세팅
- 일정/문서 관리
- 설계 데이터 업로드 또는 연동
- BOM 편집
- 목표 원가 관리

---

## 7. e-BOM과 Cost Collaboration

### e-BOM (Engineering BOM)
계층형 구조 + 수량/UOM 정보 포함

이 단계에서 가능한 것:
- 대체 부품 탐색
- 잠재 원료 탐색
- 유사 품목 추천
- 원가 시뮬레이션

### Cost Collaboration
Item별 가격 정보 종합:

| 가격 근거 | 설명 |
|---|---|
| 내부 기준 단가 | 내부 데이터 |
| Carry-over 단가 | 기존 계약 단가 |
| 시장가 | 외부 시장 기준 |
| SR/RFx 신규 견적 | 소싱 요청 결과 |
| Should-cost / Clean sheet | 내부 전문가 산정값 |

---

## 8. New Item vs Carry-over Item

| 유형 | 특징 |
|---|---|
| **New Item** | 신규 품목, 가격/공급사 정보 없을 수 있음 |
| **Carry-over Item** | 기존 제품/계약에서 사용하던 품목 |

→ New item이거나 현재 가격이 높으면 카테고리 담당자에게 SR 요청

---

## 9. Design Freeze 이후 BOM View 변경

| 단계 | BOM View |
|---|---|
| Design Freeze 전 | Engineering BOM (계층형) |
| Design Freeze 후 (Buy Mode 확정) | Flattened BOM / Sourcing BOM |

---

## 10. UX 관점: Category = Policy Container

Category detail 화면에 함께 보여야 할 것:
- 적용 정책
- 관련 Supplier rule
- Onboarding requirement
- Sourcing guidance
- Downstream process impact

> Category는 단순 dropdown/tag가 아닌 **정책과 전략의 컨테이너**로 설계해야 함
