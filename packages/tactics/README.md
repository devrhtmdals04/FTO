# 전술 설정 패키지 개요

`packages/tactics`는 시뮬레이터 전술 설정창을 독립적으로 개발·재사용할 수 있도록 구성한 UI/상태 패키지입니다. DOM 기반으로 동작하며, 호스트 애플리케이션(Viewer 등)에서 마운트 지점만 전달받으면 바로 사용할 수 있도록 설계되었습니다.

## 디렉터리 구조와 역할

- `src/components/TacticsSettingsRoot.ts`
  - 전술 설정 패널의 진입 컴포넌트입니다. DOM 요소에 패널을 렌더하고, 열기/닫기/파괴 등 라이프사이클을 관리합니다.
  - 옵션으로 외부 스토어를 주입할 수 있으며, 기본적으로 `createTacticsStore`를 사용합니다.
- `src/state/tacticsStore.ts`
  - 패널의 UI 상태를 관리하는 경량 스토어입니다.
  - 열림 상태, 전술 프리셋 목록, 선택된 프리셋 ID 등을 추적하고 구독 기반 인터페이스를 제공합니다.
- `src/models/tactic.ts`
  - 전술 프리셋과 레이어에 대한 타입 정의 및 빈 전술 프리셋을 생성하는 헬퍼(`createEmptyTactic`)를 제공합니다.
- `src/hooks/useTacticsStore.ts`
  - 스토어와 구독자를 연결하는 `bindStore` 유틸리티를 제공합니다. DOM/프레임워크 환경에 구애받지 않는 바인딩 레이어입니다.
- `src/api/types.ts`
  - 엔진 브리지와 통신할 때 사용할 수 있는 최소한의 인터페이스를 정의합니다. 실제 구현은 호스트 애플리케이션에서 제공합니다.
- `src/index.ts`
  - 외부에서 사용할 수 있도록 주요 모듈을 일괄 export 합니다.

## 기본 사용 방법

```ts
import { TacticsSettingsRoot } from "tactics";

const mount = document.getElementById("tactics-root");
if (mount) {
  const settings = new TacticsSettingsRoot({ mount });
  settings.open();
}
```

## 향후 확장 포인트

- `TacticsStore`에 엔진 연동 로직을 추가하여 실시간 전술 데이터를 반영합니다.
- `TacticsSettingsRoot`에 포메이션·레이어 편집 UI를 확장하고, 사용자 입력을 엔진 브리지(`src/api/types.ts`)와 동기화합니다.
- 필요할 경우 Storybook/Vite 환경을 추가해 패널 단독 개발 및 시각 테스트를 진행할 수 있습니다.
