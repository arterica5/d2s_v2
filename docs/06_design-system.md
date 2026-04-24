# Design System — Caidentia 2.0 (MUI Based)

> 기반: Material UI v6.1.0 (MUI for Figma)
> 톤: Light Mode
> 스타일 방향: Enterprise B2B (Clean, Structured)
> Figma: https://www.figma.com/design/YR80yp7J2It01WLHG7te9i/

---

## 1. Typography

> Font Family: **Roboto**
> Font Weights: Light(300) / Regular(400) / Medium(500) / SemiBold(600) / Bold(700)

| Style Name | Size | Weight | Line Height | Tailwind Class |
|---|---|---|---|---|
| Display 1 | 80px | 300 Light | 1.2 | `text-[80px] font-light leading-tight` |
| Display 2 | 64px | 300 Light | 1.2 | `text-[64px] font-light leading-tight` |
| Display 3 | 48px | 400 Regular | 1.2 | `text-[48px] font-normal leading-tight` |
| Heading 1 | 38px | 700 Bold | 1.2 | `text-[38px] font-bold leading-tight` |
| Heading 2 | 32px | 700 Bold | 1.25 | `text-[32px] font-bold leading-tight` |
| Heading 3 | 24px | 700 Bold | 1.3 | `text-2xl font-bold leading-snug` |
| Heading 4 | 20px | 700 Bold | 1.35 | `text-xl font-bold leading-snug` |
| Heading 5 | 16px | 600 SemiBold | 1.4 | `text-base font-semibold leading-normal` |
| 2xLarge | 20px | 400 Regular | 1.5 | `text-xl font-normal leading-relaxed` |
| xLarge | 18px | 400 Regular | 1.5 | `text-[18px] font-normal leading-relaxed` |
| Large | 16px | 400 Regular | 1.5 | `text-base font-normal leading-relaxed` |
| Medium | 14px | 400 Regular | 1.5 | `text-sm font-normal leading-relaxed` |
| Small | 12px | 400 Regular | 1.5 | `text-xs font-normal leading-normal` |
| xSmall | 10px | 400 Regular | 1.4 | `text-[10px] font-normal leading-normal` |

### Font Weight 토큰
```js
fontWeightLight:    300
fontWeightRegular:  400
fontWeightMedium:   500
fontWeightSemiBold: 600
fontWeightBold:     700
```

### React 프로토타입 적용 패턴
```jsx
// Google Fonts import (index.html 또는 상단에 추가)
// @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');

// 타이포그래피 상수
const typography = {
  display1: "text-[80px] font-light leading-tight",
  display2: "text-[64px] font-light leading-tight",
  display3: "text-[48px] font-normal leading-tight",
  h1: "text-[38px] font-bold leading-tight",
  h2: "text-[32px] font-bold leading-tight",
  h3: "text-2xl font-bold leading-snug",
  h4: "text-xl font-bold leading-snug",
  h5: "text-base font-semibold leading-normal",
  body2xl: "text-xl font-normal leading-relaxed",
  bodyXl: "text-[18px] font-normal leading-relaxed",
  bodyLg: "text-base font-normal leading-relaxed",
  bodyMd: "text-sm font-normal leading-relaxed",
  bodySm: "text-xs font-normal leading-normal",
  caption: "text-[10px] font-normal leading-normal",
};
```

---

## 2. Spacing 토큰

| Token | Value | Tailwind 근사값 |
|---|---|---|
| spacingNone | 0px | `p-0` |
| spacing2Xs | 2px | `p-0.5` |
| spacingXs | 4px | `p-1` |
| spacingSm | 8px | `p-2` |
| spacingMd | 12px | `p-3` |
| spacingLg | 16px | `p-4` |
| spacingXl | 24px | `p-6` |
| spacing2Xl | 32px | `p-8` |
| spacing3Xl | 40px | `p-10` |
| spacing4Xl | 48px | `p-12` |
| spacing5Xl | 64px | `p-16` |
| spacing6Xl | 80px | `p-20` |
| spacing7Xl | 96px | `p-24` |

---

## 3. Border Radius 토큰

| Token | Value | 용도 |
|---|---|---|
| radiusNone | 0px | 없음 |
| radiusXs | 2px | 아주 작은 요소 |
| radiusSm | 4px | 칩, 뱃지 |
| radiusMd | 6px | 인풋, 버튼 소형 |
| radiusLg | 8px | 버튼, 카드 기본 |
| radiusXl | 12px | 카드, 패널 |
| radius2Xl | 16px | 모달, 큰 카드 |
| radius3Xl | 24px | 바텀시트 |
| radiusFull | 1000px | 알약형 버튼, 아바타 |

---

## 4. Border Width 토큰

| Token | Value | 용도 |
|---|---|---|
| borderWidthNone | 0px | 없음 |
| borderWidthSm | 0.5px | 얇은 구분선 |
| borderWidthMd | 1px | 기본 테두리 |
| borderWidthLg | 2px | 강조 테두리, Focus ring |
| borderWidthXl | 4px | 강한 강조 |

---

## 5. Opacity 토큰

| Token | Value | 용도 |
|---|---|---|
| opacityDimmed | 30% | 딤 처리 |
| opacityDisabled | 50% | 비활성 요소 |
| opacityOverlay | 70% | 모달 오버레이 |
| opacityFull | 100% | 기본 |

---

## 6. Breakpoints

| Token | Value | 용도 |
|---|---|---|
| xs | 444px | 모바일 소형 |
| sm | 600px | 모바일 |
| md | 900px | 태블릿 |
| lg | 1200px | 데스크탑 |
| xl | 1536px | 와이드 |

---

## 7. Icon Size 토큰

| Token | Value | 용도 |
|---|---|---|
| iconSizeXs | 12px | 인라인 아이콘 |
| iconSizeSm | 16px | 소형 아이콘 |
| iconSizeSmMd | 20px | 버튼 내 아이콘 |
| iconSizeMd | 24px | 기본 아이콘 (lucide-react 기본값) |
| iconSizeLg | 32px | 강조 아이콘 |
| iconSizeXl | 40px | 대형 아이콘 |

---

## 2. Color System

### Primary (Brand Color — Purple/Indigo 계열)
| Token | Usage |
|---|---|
| primary/main | 주요 버튼, 활성 상태, 강조 요소 |
| primary/dark | Hover 상태 |
| primary/light | 배경 강조, 선택 영역 |
| primary/contrastText | Primary 위의 텍스트 (white) |
| primary/hover | Hover 오버레이 (opacity 0.04) |
| primary/selected | Selected 오버레이 (opacity 0.08) |
| primary/focus | Focus 오버레이 (opacity 0.12) |
| primary/outlinedBorder | Outlined 버튼 테두리 (opacity 0.5) |

> Primary 컬러: **#532DF6** (Violet/Purple)

### Semantic Colors
| 카테고리 | main | dark | light | 용도 |
|---|---|---|---|---|
| **Error** | `#D32F2F` | `#B71C1C` | `#FFAB9F` | 오류, 삭제, 위험 |
| **Warning** | `#E06900` | `#B34500` | `#FFC84A` | 경고, 주의 |
| **Info** | `#1565E0` | `#1246CC` | `#82CAFF` | 정보, 안내 |
| **Success** | `#009955` | `#006B3C` | `#6DEAA6` | 완료, 성공, 승인 |
| **Secondary** | `#4B5565` (Dark Slate) | `#333C48` | 연한 Slate | 보조 액션 |

### Text Colors
| Token | 용도 |
|---|---|
| text/primary | 기본 본문 텍스트 |
| text/secondary | 보조 텍스트, 설명 |
| text/disabled | 비활성 텍스트 |

### Background Colors
| Token | 용도 |
|---|---|
| background/default | 페이지 기본 배경 (Light gray, ~#F5F5F5) |
| background/paper | 카드, 패널 배경 (White, #FFFFFF) |
| background/container secondary | 2차 컨테이너 배경 |
| background/container tertiary | 3차 컨테이너 배경 |
| background/surface underlay | 최하단 서피스 |
| paper/elevation 0 | 플랫 카드 |
| paper/elevation 2 | 기본 카드 (약한 그림자) |
| paper/elevation 16 | 드롭다운, 팝오버 |
| paper/elevation 24 | 모달, 다이얼로그 |

### Action Colors
| Token | 용도 |
|---|---|
| action/active | 활성 아이콘 |
| action/hover | 호버 오버레이 |
| action/selected | 선택 오버레이 |
| action/disabled | 비활성 텍스트 |
| action/disabledBackground | 비활성 배경 |
| action/focus | 포커스 오버레이 |

### SRM 프로젝트 전용 상태 컬러 (Status Badge용)
| 상태 | 컬러 | Tailwind 클래스 |
|---|---|---|
| 진행중 (In Progress) | Info/Blue | `bg-blue-100 text-blue-700` |
| 완료 (Completed) | Success/Green | `bg-green-100 text-green-700` |
| 차단 (Blocked) | Error/Red | `bg-red-100 text-red-700` |
| 대기 (Pending) | Warning/Amber | `bg-amber-100 text-amber-700` |
| 미시작 (Not Started) | Gray | `bg-gray-100 text-gray-600` |
| 검토중 (Under Review) | Purple | `bg-purple-100 text-purple-700` |
| 승인됨 (Approved) | Success/Green | `bg-emerald-100 text-emerald-700` |
| 반려 (Rejected) | Error/Red | `bg-red-100 text-red-600` |

---

## 3. Components Overview

Figma 기준 컴포넌트 카테고리 (Components_Overview.png 참조):

### Inputs Overview
- Text Field (기본, 오류, 비활성)
- Select / Dropdown
- Checkbox, Radio Button
- Toggle / Switch
- Slider
- Date Picker (MUI X)
- Autocomplete

### Feedback Overview
- Dialog / Modal
- Alert (Error, Warning, Info, Success)
- Snackbar / Toast
- Progress (Linear, Circular)
- Skeleton Loader

### Navigation Overview
- Top App Bar / Header
- Tabs
- Breadcrumb
- Stepper
- Pagination
- Side Navigation / Drawer

### Surfaces Overview
- Card (elevation 0, 2, 16, 24)
- Accordion / Expansion Panel
- Divider
- Paper

### Data Display Overview
- Table / Data Grid (MUI X)
- Avatar
- Chip / Tag / Badge
- Tooltip
- Tree View (BOM 구조에 활용)
- Timeline

### Layout Overview
- Grid System (12-column)
- Container
- Stack
- Box

### MUI X Overview
- Data Grid (정렬, 필터, 그룹핑)
- Date Picker / Date Range Picker
- Charts (Bar, Line, Pie)
- Tree Data Grid (BOM 트리에 활용)

---

## 4. SRM 프로젝트 공통 컴포넌트 패턴

### BOMTreeNode
BOM 계층 구조 표현 시 사용
```
[▼] Item Code | Item Name | Qty | UOM | Unit Price | Status
  [▼] Child Item ...
      [—] Leaf Item ...
```
- MUI X Tree Data Grid 기반
- 상태 뱃지 인라인 표시
- 버전 변경 시 델타 하이라이트 (노란색 배경)

### StatusBadge
```jsx
// 상태에 따라 색상 자동 변경
<StatusBadge status="in-progress" />  // 파란 뱃지
<StatusBadge status="completed" />    // 초록 뱃지
<StatusBadge status="blocked" />      // 빨간 뱃지
```

### SectionCard
모든 화면의 기본 컨테이너 단위
- Paper elevation 2
- 헤더 (제목 + 우측 액션 버튼)
- 컨텐츠 영역
- 선택적 푸터

### PageHeader
모든 화면 상단 공통 구조
- 브레드크럼
- 페이지 타이틀
- 우측 Primary CTA 버튼

### DataTable
MUI X Data Grid 기반
- 컬럼 정렬, 필터 기본 제공
- 행 선택 (단일/다중)
- 인라인 상태 뱃지

---

## 5. 레이아웃 구조

### 전체 레이아웃
```
┌─────────────────────────────────────┐
│ GNB (Global Navigation Bar)         │ 높이: 64px
├──────────┬──────────────────────────┤
│ LNB      │ Main Content Area        │
│ (Side    │                          │
│ Nav)     │  PageHeader              │
│          │  ──────────────────────  │
│ 240px    │  Content (Cards/Tables)  │
│          │                          │
└──────────┴──────────────────────────┘
```

### 반응형 기준
- Desktop: LNB 고정 표시 (240px)
- Tablet: LNB 축소 (64px, 아이콘만)
- Mobile: LNB 숨김 (햄버거 메뉴)

### 컨텐츠 영역 여백
- Page padding: 24px
- Card gap: 16px
- Section gap: 24px

---

## 6. 아이콘

**lucide-react** 사용 (React 프로토타입 기준)

| 용도 | 아이콘 |
|---|---|
| BOM | `GitBranch`, `Network` |
| Item/Part | `Package`, `Box` |
| Cost | `DollarSign`, `TrendingDown` |
| Sourcing/RFx | `FileText`, `Send` |
| Supplier | `Building2`, `Users` |
| Quality/PPAP | `ShieldCheck`, `ClipboardCheck` |
| 경고/리스크 | `AlertTriangle`, `AlertCircle` |
| 완료 | `CheckCircle`, `Check` |
| 차단 | `XCircle`, `Ban` |
| 필터 | `Filter`, `SlidersHorizontal` |
| 설정 | `Settings`, `Cog` |
| 파일 | `FileText`, `Paperclip`, `Upload` |
| 검색 | `Search` |
| 추가 | `Plus`, `PlusCircle` |
| 더보기 | `MoreHorizontal`, `MoreVertical` |
| 뒤로 | `ChevronLeft`, `ArrowLeft` |
| 펼치기 | `ChevronDown`, `ChevronRight` |

---

## 7. React 프로토타입 코드 규칙

```jsx
// 기본 임포트 구조
import { useState, useEffect } from "react";
import { Package, AlertTriangle, CheckCircle } from "lucide-react";

// 컬러 변수 (Tailwind 클래스로 매핑)
const colors = {
  // Primary
  primary: "#532DF6",                          // primary/main
  primaryDark: "#3D1FD4",                      // primary/dark
  primaryLight: "#EDE9FE",                     // primary/light (~#AD9EFF 계열)

  // Secondary
  secondary: "#4B5565",                        // secondary/main
  secondaryDark: "#333C48",                    // secondary/dark
  secondaryLight: "#E9EAEC",                   // secondary/light

  // Semantic
  error: "#D32F2F",                            // error/main
  errorDark: "#B71C1C",                        // error/dark
  errorLight: "#FFAB9F",                       // error/light
  warning: "#E06900",                          // warning/main
  warningDark: "#B34500",                      // warning/dark
  warningLight: "#FFC84A",                     // warning/light
  info: "#1565E0",                             // info/main
  infoDark: "#1246CC",                         // info/dark
  infoLight: "#82CAFF",                        // info/light
  success: "#009955",                          // success/main
  successDark: "#006B3C",                      // success/dark
  successLight: "#6DEAA6",                     // success/light

  // Background
  background: "#F5F5F5",                       // background/default
  surface: "#FFFFFF",                          // background/paper
  border: "#E0E0E0",

  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  textDisabled: "#9CA3AF",
};

// 인라인 스타일로 적용 (커스텀 hex라 Tailwind 클래스 불가)
// style={{ backgroundColor: "#532DF6", color: "#fff" }}
// style={{ color: "#532DF6" }}
// style={{ borderColor: "#532DF6" }}

// 목업 데이터는 컴포넌트 상단에 const로 선언
const MOCK_DATA = [...];

// 단일 파일 App.jsx로 작성
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* GNB */}
      {/* LNB */}
      {/* Main Content */}
    </div>
  );
}
```

---

## 8. 참고

- Figma 원본: https://www.figma.com/design/YR80yp7J2It01WLHG7te9i/
- 기반 라이브러리: Material UI v6.1.0
- React 프로토타입: lucide-react + Tailwind CSS (MUI 컴포넌트 구조 참조)
- 정확한 hex 컬러값은 Figma 원본에서 확인 후 업데이트 필요
