# Caidentia D2S (Design-to-Source)

SRM(Supplier Relationship Management) 플랫폼의 설계–소싱–원가–품질 협업 워크스페이스. BOM 중심 협업, 조기 원가/공급사 가시성, 설계 변경 영향도 추적이 핵심 가치.

**기반 스택 (계획):** React + MUI v6 + Tailwind (Figma: Material UI for Figma)
**톤/스타일:** Light Mode, Enterprise B2B, Roboto

---

## 핵심 페르소나

@docs/personas.md 참조. 요약:
- **PM** — 일정/비용/단계 통과 여부 가시성
- **Design Engineer** — 설계 변경 시 원가/공급사/타당성 즉시 확인
- **Cost Manager** — 조기 개입, should-cost 기반 협상
- **Sourcing Manager** — 공급사 feasibility 검증 후 RFQ
- **Quality Manager** — 공급사 공정 리스크 조기 포착
- **Supplier** — BOM/RFQ 변경 투명성, 정확한 견적

---

## 프로덕트 정의 문서

설계·기획 시 반드시 먼저 확인:

- @docs/02_pain-points-cx-strategy.md — Core pain points 3가지 + CX 전략 (Shared BOM Workspace, Multi-dim BOM Exploration, Shared Impact Visibility)
- @docs/03_bom-product-definition.md — BOM 및 제품 정의
- @docs/04_category-strategy.md — 카테고리 전략
- @docs/05_ux-key-points.md — UX 핵심 원칙 (권한 가시성, Progressive Disclosure, Org 설정 UX 등)
- @docs/06_design-system.md — Caidentia 2.0 디자인 시스템 (Typography, Color, Spacing, Components)
- @docs/07_screen-inventory.md — 전체 화면 인벤토리 (우선순위/상태)

---

## 항상 적용되는 빌드 스킬

UI 코드 작성 시 매 요청마다 참조:

- @docs/frontend-design/SKILL.md — 프로덕션급 프런트엔드 구현 가이드 (aesthetic philosophy 기반)
- @docs/design-tokens/SKILL.md — 디자인 토큰 체계 (CSS vars / Tailwind config, 컴포넌트 토큰)

---

## 디자인 작업 스킬 라이브러리

작업 유형별로 해당 디렉터리의 `SKILL.md` / `README.md`를 참조:

| 영역 | 경로 |
|---|---|
| UX 전략 | `docs/ux-strategy/` |
| 리서치 | `docs/design-research/` |
| 정보 구조 | `docs/information-architecture/SKILL.md` |
| 인터랙션 | `docs/interaction-design/` |
| UI 디자인 | `docs/ui-design/` |
| 디자인 시스템 | `docs/design-systems/`, `docs/design-tokens/SKILL.md` |
| 프로토타이핑/테스트 | `docs/prototyping-testing/` |
| 디자인 운영 | `docs/design-ops/` |
| 디자인 리뷰 | `docs/design-review/SKILL.md` |
| 프런트엔드 변환 | `docs/frontend-design/SKILL.md` |
| 브리프 → 태스크 | `docs/brief-to-tasks/SKILL.md` |
| 결과물 작성 | `docs/designer-toolkit/` |

---

## 작업 원칙

1. **BOM-first** — 모든 협업의 중심은 BOM. 신규 기능 설계 시 "이 기능이 BOM 워크스페이스와 어떻게 연결되는가?"를 먼저 답할 것.
2. **Shared Impact Visibility** — 설계 변경의 원가/공급/일정 영향을 즉시 가시화.
3. **Progressive Disclosure** — 복잡한 권한·상태는 UI에 그대로 드러내지 말 것.
4. **Role-aware UI** — 6개 페르소나 각각의 KPI/Pain Point를 기준으로 기능을 평가.
5. **Light Mode · Enterprise B2B 톤** — MUI v6 + Tailwind 패턴 유지.

---

## 리포지토리 상태

- 브랜치: `claude/copy-src-files-T2bPd`
- 현재 `docs/` 만 존재. 소스 코드는 아직 없음.
- 프런트엔드 스캐폴딩(`src/`) 준비 예정.
