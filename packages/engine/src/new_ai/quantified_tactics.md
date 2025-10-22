# QuantifiedTactics 사용 가이드

## 결과 구조 개요

`QuantifiedTactics`는 전술 JSON을 파싱한 뒤 아래 정보를 제공합니다 (`packages/engine/src/ai/tactics.rs`):

| 필드 | 설명 |
| --- | --- |
| `version` | 구조 버전. 스키마 변경 시 숫자를 올립니다. 현재 `1` |
| `base_attacking_shape` / `base_defending_shape` | 기본 공격/수비 포메이션 문자열 |
| `set_piece_attack_shape` / `set_piece_defence_shape` | 세트피스 전용 포메이션 식별자 |
| `phase_directives: HashMap<String, PhaseDirective>` | 팀 페이즈 키 → 지시 내용 |
| `meta: HashMap<String, f32>` | 공격 성향 수치 등 기타 값 (`pass_distance`, `goalkeeper_engage` 등) |

`PhaseDirective`는 다음 두 부분으로 구성됩니다.

```rust
pub struct PhaseDirective {
    pub shape: Option<String>, // 해당 페이즈에 우선 적용할 포메이션
    pub focus: PhaseFocus,     // 페이즈별 가중치(0.0~1.0)
}

pub struct PhaseFocus {
    pub width: f32;    // 폭을 넓힐수록 1.0에 가까움
    pub depth: f32;    // 전진 깊이/라인 높이
    pub tempo: f32;    // 플레이 리듬(빠르게 → 1.0)
    pub pressure: f32; // 압박 세기(수비 시)
}
```

페이즈 키는 아래와 같이 구성되어 있습니다.

| 키 | 대응 `TeamPhase` |
| --- | --- |
| `kickoff_attack` | `TeamPhase::KickoffAttack` |
| `set_piece_attack` | `TeamPhase::SetPieceAttack` |
| `set_piece_defence` | `TeamPhase::SetPieceDefense`, `KickoffDefense` |
| `build_up` | `TeamPhase::BuildUp` |
| `progression` | `TeamPhase::Progression` |
| `final_third` | `TeamPhase::FinalThird` |
| `high_block` | `TeamPhase::HighBlock` |
| `mid_block` | `TeamPhase::MidBlock` |
| `low_block` | `TeamPhase::LowBlock` |

미정의된 페이즈(`Neutral`)는 `directive_for_phase` 호출 시 `None`을 반환합니다.

## AI에서 사용하는 방법

1. **전술 모델 가져오기**  
   `PlayerClass` 생성 시 `TacticModel`이 주입되며, `quantified_tactics` 필드에 그대로 저장됩니다 (`packages/engine/src/player_class.rs:47`).
 
 2. **페이즈별 지시 조회**  
    AI 루프에서 현재 팀 페이즈를 알고 있다면:
   ```rust
   let qt = &player_class.quantified_tactics;
   if let Some(directive) = qt.directive_for_phase(team_phase) {
       let focus = directive.focus;
       let preferred_shape = directive.shape.as_deref();
       // focus.width/depth/tempo/pressure 값을 사용해 행동 점수나 포지셔닝을 조절
   }
   ```

   킥오프/세트피스 배치가 필요하면 `kickoff_positions` / `set_piece_positions` 헬퍼를 사용하세요 (`packages/engine/src/ai/restarts.rs`).
   ```rust
   use crate::ai::restarts::{kickoff_positions, set_piece_positions};

   let layout = kickoff_positions(team_id, true, &player_class.quantified_tactics);
   let striker_spot = layout.positions[1];
   ```

3. **메타 값 활용**  
   특정 수치를 읽고 싶으면 `meta_value`를 사용합니다. 예)
   ```rust
   if let Some(pass_distance) = qt.meta_value("pass_distance") {
       // 패스 선호도를 0.0~1.0 범위로 활용
   }
   ```
   신규 지표가 필요하면 `quantify` 함수에서 `qt.meta.insert("새_키", 값);` 방식으로 손쉽게 확장할 수 있습니다.

4. **포지셔닝/전술 적용 예시**
   - `focus.width`를 `PositioningWeights` 조정에 사용하여 빌드업/프로그레션 시 폭을 늘리거나 줄일 수 있습니다.
   - `focus.pressure`는 수비 페이즈에서 압박 강도를 판단하는 스칼라 값으로 활용할 수 있습니다.
   - `shape` 값은 페이즈 전환 시 사용할 포메이션 식별자입니다. 향후 set-piece 전개 로직을 구현할 때 해당 문자열을 분석하여 배치 좌표를 불러오면 됩니다.

## 향후 확장 포인트

- `meta` 맵은 자유롭게 키/값을 추가할 수 있으므로, 예를 들어 `"invert_fullback"`, `"wing_switch_bias"` 같은 새로운 파라미터를 넣어도 파서 변경 없이 활용 가능합니다.
- 필요 시 `QuantifiedTactics`에 메서드를 추가해 페이즈간 보간이나 기본값 처리 로직을 더할 수 있습니다.
- 프런트엔드에서도 동일 필드를 노출하므로 시각화를 위한 HMI를 쉽게 붙일 수 있습니다 (`packages/viewer-3d/src/state.ts`).

이 구조는 전술 스키마가 변해도 키를 추가하거나 수치를 다르게 채우는 정도로 대응할 수 있도록 설계되었습니다. 신규 페이즈가 추가되면 `directive_for_phase` 매핑만 확장하면 됩니다.
