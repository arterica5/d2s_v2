# UX 관점 핵심 포인트

---

## 1. 사용자는 "내가 지금 어디 범위에서 일하는지"를 알아야 함

Org interconnection, Task Group, Role 기반 3중 접근 제어 구조 → 사용자 입장에서 데이터 가시성이 불투명해질 수 있음

### UX Implication
- 현재 작업 컨텍스트(org, 데이터 범위, 기능 권한)를 항상 노출
- 접근 불가 이유를 설명하는 메시지 필요
- 메뉴 상태 구분: **비노출 / 비활성(Disabled) / 읽기전용(Read-only)**

---

## 2. 권한 구조가 복잡할수록 UI는 단순해야 함

백엔드는 Org / Task Group / RBAC / Conditional Report 4중 권한 제어 → UI가 이 복잡함을 그대로 드러내면 사용자 혼란

### UX Implication
- **Progressive Disclosure**: 불필요한 옵션은 미리 숨김
- 기능 상태 구분: 보기만 가능 / 생성 가능 / 수정 불가
- 권한 로직은 숨기되 결과는 명확히 표시

---

## 3. Org 변경 비용이 크므로 설정 UX가 매우 중요함

Org 변경 → 유저 매핑, Item/Supplier Interconnection, Onboarding Org까지 전체 영향
→ 단순 설정값이 아니라 **시스템 골격**

### UX Implication
- 관리자용 설정 화면은 단순 폼이 아닌 **영향도 시뮬레이션** 필요
- 변경 전 "무엇이 바뀌는지" Preview 제공
- **Setup Wizard / Validation UX** 중요

---

## 4. Supplier UX는 "한 회사"가 아니라 "여러 역할/관계"로 보여야 함

Supplier = 단일 객체가 아님
- 제품군별 Multi-org 가능
- Ultimate / Elementary / Franchise / Distributor / Manufacturer 등 다양한 관계

### UX Implication
- Supplier를 **Relationship-aware Object**로 표현
- "계약 주체 / 견적 제출자 / 제조사" 역할 분리 표시
- Supplier Hierarchy / Affiliation / Access Scope 시각적 구분

---

## 5. N-tier 공급망은 트리보다 네트워크처럼 보여야 함

2차/3차 공급망은 단순 계통도로 표현 불가
→ 동일 Supplier가 여러 경로에서 재등장 가능

### UX Implication
- 단순 Tree View보다 **Network / Graph View** 검토 필요
- Relationship Tracing, Path Highlight, Dependency Exploration 기능 중요
- "누가 누구와 연결돼 있는가"를 따라가는 **탐색 UX** 설계

---

## 6. Category는 단순 분류값이 아니라 정책의 출발점

Category = Sourcing Strategy / Onboarding Rule / Supplier Diversity / APQP·PPAP 등 후속 프로세스를 결정하는 **상위 전략 레이어**

### UX Implication
- Category를 단순 Dropdown / Tag로 다루면 안 됨
- Category Detail 화면에 함께 표시할 것:
  - 적용 정책
  - 관련 Supplier Rule
  - Onboarding Requirement
  - Sourcing Guidance
  - Downstream Process Impact
- **Category = Policy Container**로 설계

---

## 7. Make/Buy, Supplier 수, Quality Process는 전략의 결과물로 보여야 함

현업 담당자가 건건이 판단하는 게 아니라 앞단 전략에서 내려오는 값

### UX Implication
- D2S/소싱 화면에서 사용자가 모든 걸 처음부터 결정하는 UI는 부적합
- "이 결정은 어떤 전략/카테고리 규칙에서 왔는지" 설명하는 구조 필요
- **Recommendation / Constraint / Explanation UI** 중요

---

## 8. 사전 정의보다 사후 연결 — 결과 중심 UX

Supplier-Category 관계는 Transaction 이후 결과적으로 형성되는 구조

### UX Implication
- Onboarding → Sourcing → Performance → **Supplier 360에서 관계가 드러나는 구조**
- "이 Supplier는 어떤 Category와 연결돼 있는가"를 결과 기반 Summary View로 표시
- Static Master Maintenance보다 **Activity / History 기반 UX** 우선

---

## 9. Category 360 같은 통합 정보 허브가 핵심

Category = 시장 데이터 / 전략 / 가이드라인 / Downstream Process 연결 허브

### UX Implication
- **Category 360**: 전략 대시보드 + 실행 출발점 통합 뷰
- 한 화면에서 전략, 관련 Item, Supplier 현황, 리스크, 가이드라인 연결
- 정보가 흩어지면 Category의 의미가 약해짐

---

## 10. AI는 기능 버튼이 아니라 새로운 작업 공간

AI = 기존 화면에 붙는 부가기능이 아니라, 문서 생성/프로세싱/자동화를 감싸는 **새로운 Interaction Layer**

### UX Implication
- 챗봇 아이콘 추가 수준으로는 부족
- **AI Workspace**: 별도 작업 환경으로 설계
- 사용자 이동 방향: 화면 탐색 → 자연어 지시 / 문서 생성 / 에이전트 실행
- 기존 MVC 화면 위계와 AI Workspace의 관계를 새로 정의 필요

---

## 11. Workflow Automation UX는 "대화형 구성"이 더 적합

사용자가 질의응답으로 원하는 Automation 설명 → 시스템이 Workflow 생성 및 배포

### UX Implication
- 노코드 Builder만으로는 한계
- **Conversational Automation Setup UX** 중요
- 흐름: 자동화 생성 → 테스트 → 확인 → 퍼블리시

---

## 핵심 요약 (설계 원칙 5가지)

1. **현재 컨텍스트를 명확히 보여줘야 함** — 사용자가 지금 어떤 Org/Category/Supplier Scope에서 일하는지 항상 표시
2. **Category를 단순 필드로 다루면 안 됨** — 정책과 전략의 컨테이너로 설계
3. **Supplier는 프로필이 아니라 관계 네트워크로 봐야 함** — Supplier Hierarchy와 역할 분리 중요
4. **D2S/소싱 UI는 자유 입력보다 전략 설명형이어야 함** — 권장안/제약의 이유를 설명하는 방향
5. **AI는 보조 기능이 아니라 새 Workspace로 접근** — 기존 화면 UX와 AI Interaction UX를 별도 설계
