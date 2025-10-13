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
- 'engine'의 tactic관리 전면 개편 필요. 1팀, 2팀. 먼저 포메이션을 유지하도록.


## UI의 Tactic이 엔진의 Tactics로 변환되는 과정과, 엔진이 이 Tactics 파라미터를 처리하는 방법에 대해 더 자세한 설명.

  1. 변환 과정: UI의 전술 의도를 엔진의 언어로 번역

  이 변환의 핵심은 packages/tactics/src/utils/translator.ts 파일에 있는 tacticToEngineParams 함수입니다. 이 함수는 UI에서 만들어진
  Tactic 객체를 입력받아, 엔진이 사용할 수 있는 EngineTactic (Rust의 Tactics 구조체와 동일) 숫자 파라미터 묶음으로 번역하는 역할을
  합니다.

  변환 과정은 다음과 같은 단계로 이루어집니다.

   1. 기본값(Default)으로 시작:
      모든 파라미터가 중간값(0.5)으로 설정된 BASE_PARAMS에서 변환을 시작합니다. 이는 어떤 특성도 갖지 않는 '중립' 상태입니다.

   1     const BASE_PARAMS: EngineTactic = {
   2       line_height: 0.5,       // 수비 라인 높이
   3       press_intensity: 0.5,   // 압박 강도
   4       team_width: 0.5,        // 팀 전체 너비
   5       // ... 등등
   6     };

   2. 스타일에 따른 파라미터 조정:
      사용자가 선택한 추상적인 '스타일' 지침을 구체적인 숫자 값으로 변환합니다. 예를 들어, 전환(transition) 스타일 설정에 따라 다음과
  같이 파라미터가 조정됩니다.

       * on_loss가 'press_on_heavy_touch' (즉시 재압박) 이면:
           * press_intensity (압박 강도)를 0.8로 높입니다.
           * counter_press (역압박)를 0.8로 높입니다.
       * on_loss가 'fall_back' (라인 유지) 이면:
           * press_intensity를 0.3으로 낮춥니다.
           * counter_press를 0.3으로 낮춥니다.

   3. 포메이션에 따른 파라미터 조정:
      포메이션 구조 또한 엔진 파라미터에 영향을 줍니다. 예를 들어, 수비수 숫자에 따라 수비 라인의 높이를 조절합니다.

       * 포메이션이 '3'으로 시작하면 (예: 3-4-3):
           * line_height (수비 라인)를 0.7로 높여 공격적인 라인을 형성합니다.
           * overlap_fullbacks (풀백 오버래핑)을 0.7로 높입니다.
       * 포메이션이 '5'로 시작하면 (예: 5-3-2):
           * line_height를 0.3으로 낮춰 수비적인 라인을 구축합니다.
           * overlap_fullbacks를 0.2로 낮춥니다.

   4. 전술 이름(Label)에 따른 추가 조정:
      전술의 이름 자체도 중요한 힌트가 됩니다. "Attacking"이나 "Defensive" 같은 이름이 붙어있으면, 전반적인 성향을 한 번 더 조정합니다.

       * 이름이 'Attacking' 이면:
           * line_height를 최소 0.7 이상으로 보정하고, build_up (빌드업 방식)을 0.8로 높입니다.
       * 이름이 'Defensive' 이면:
           * line_height를 최대 0.3 이하로 보정하고, press_intensity를 0.4 이하로 낮춥니다.

  이처럼 tacticToEngineParams 함수는 여러 규칙을 단계적으로 적용하여, 사용자의 복합적인 전술 설정을 엔진이 이해할 수 있는 8개의 간단한
  숫자 파라미터로 최종 번역합니다.

  ---

  2. 엔진의 처리: 숫자 파라미터를 선수들의 움직임으로

  엔진은 변환된 Tactics 파라미터를 받아 선수들의 AI 의사결정에 직접 사용합니다. 이 파라미터들은 state.rs의 World 구조체 안에 tactics: 
  [Tactics; N_TEAMS] 형태로 각 팀별로 저장됩니다.

  시뮬레이션이 매 틱(tick) 실행될 때, 선수들의 AI 로직은 이 값들을 참조하여 자신의 행동을 결정합니다. ai 관련 모듈(예:
  off_the_ball_action.rs, defensive_action.rs 등)에서 이 값들이 사용될 것입니다.

  예를 들어, press_intensity (압박 강도) 파라미터가 높다면 (0.8):

   * 수비 상황에서: 공을 갖지 않은 선수(off the ball)는 공을 가진 상대 선수에게 더 적극적으로 달려들어 압박할 확률이 높아집니다.
   * 공격수: 상대 수비수가 공을 잡았을 때, 전방 압박을 시도하는 빈도와 강도가 높아집니다.
   * 미드필더: 중원에서 상대의 패스 길을 차단하려는 움직임이 더 공격적으로 변합니다.

  반대로 line_height (수비 라인) 파라미터가 낮다면 (0.3):

   * 수비수들: 상대가 공격해 올 때, 페널티 박스 근처까지 깊숙이 물러나서 수비벽을 형성하려는 경향이 강해집니다.
   * 팀 전체: 팀의 무게 중심이 전체적으로 우리 팀 골대 쪽으로 치우치게 됩니다.

  이처럼 엔진은 Tactics의 각 숫자 파라미터를 AI 모델의 다양한 판단 기준(거리, 확률, 행동 우선순위 등)에 곱하거나 더하는 방식으로
  활용하여, 결과적으로 11명 선수들의 유기적인 움직임과 팀 전체의 전술적 성향을 만들어냅니다.