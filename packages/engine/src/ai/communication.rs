//this is communication module.

// 네, 좋습니다. 이전의 '메시지 버스' 방식은 매우 유연하지만 복잡할 수 있습니다.

// 가장 간단한 커뮤니케이션 모듈은 '메시지'를 보내는 대신, 모든 선수가 자신의 '상태'를 공개적으로(Publicly) 게시하고, 다른 선수들이 그 상태를 '인지(Perception)'하게 하는 방식입니다.

// 가장 중요한 "나에게 패스해 줘!" 기능만으로 간단하게 설계해 보겠습니다.

// 1. Player 구조체에 '상태' 변수 추가
// 먼저 Player 구조체에 모든 아군이 읽을 수 있는 '상태' 변수 하나를 추가합니다.

// Rust

// STRUCT Player {
//     id: u32,
//     position: Vector2,
//     has_ball: bool,
//     // ... (기존 변수들) ...

//     // --- (NEW) 간단한 커뮤니케이션 변수 ---
//     // "내가 패스 받기 얼마나 좋은 상태인가?" (0.0 ~ 1.0)
//     pub pass_request_score: f32, 
// }
// 2. AI 업데이트 루프 (2-Pass 방식)
// 이것이 핵심입니다. AI 업데이트를 두 단계로 나누어야 합니다.

// [Pass 1] (공 없는 선수들): 모든 공 없는 선수들이 먼저 자신의 pass_request_score를 계산해서 '게시'합니다.

// [Pass 2] (공 가진 선수): 공 가진 선수가 모든 아군의 '게시된' 점수를 읽고 최고의 패스 대상을 결정합니다.

// 3. 의사 코드
// 1단계: 점수 '게시' (Off-Ball Players)
// 모든 공 없는 선수들이 자신의 Decision 단계에서 이 함수를 실행합니다.

// Rust

// // (AI 틱의 첫 번째 단계에서 호출됨)
// FUNCTION update_all_pass_request_scores(
//     players: List<Player>, 
//     opponents: List<Player>, 
//     xT_Map: Grid
// ) {
//     FOR player in players {
//         // 공 가진 선수는 요청 점수가 0
//         IF player.has_ball {
//             player.pass_request_score = 0.0;
//             CONTINUE;
//         }

//         // --- [Decision] "나는 패스를 받을 만한가?" ---
//         // (Perception) 나의 공간 점수와 xT 점수를 인지
//         let my_space = calculate_normalized_space_score(player.position, opponents);
//         let my_xt = calculate_normalized_xt_score(player.position, xT_Map, player.is_home_team);

//         // (Decision) 공간이 70%, xT가 30% 중요하다고 가정
//         let final_request_score = (my_space * 0.7) + (my_xt * 0.3);

//         // --- [Execution] 나의 상태를 '게시' ---
//         player.pass_request_score = clamp(final_request_score, 0.0, 1.0);
//     }
// }
// 2단계: 점수 '인지' 및 행동 (On-Ball Player)
// 공 가진 선수가 자신의 Decision 단계에서 이 함수를 실행합니다.

// Rust

// // (AI 틱의 두 번째 단계에서 호출됨)
// FUNCTION decide_ball_carrier_action(
//     ball_carrier: Player, 
//     teammates: List<Player>
// ) -> Action {

//     // --- [Perception] 아군들의 "패스 줘!" 점수 인지 📡 ---
//     let mut best_pass_target = NULL;
//     let mut highest_score = 0.0;

//     FOR teammate in teammates {
//         IF teammate.pass_request_score > highest_score {
//             highest_score = teammate.pass_request_score;
//             best_pass_target = teammate;
//         }
//     }

//     // --- [Decision] 최고의 패스 대상을 결정 🧠 ---
    
//     // (예: 0.8점 이상의 '아주 좋은' 요청이 있을 때만 패스)
//     IF highest_score > 0.8 {
//         RETURN Action::Pass(best_pass_target);
//     } 
//     // (만약 0.5점 정도의 '적당한' 요청이 있다면...)
//     ELSE IF highest_score > 0.5 {
//          // (그리고 내가 압박받고 있다면 패스)
//         IF is_player_under_pressure(ball_carrier) {
//             RETURN Action::Pass(best_pass_target);
//         }
//     }
    
//     // 마땅한 패스 대상이 없으면 드리블
//     RETURN Action::Dribble;
// }
// AI 메인 루프 (결합)
// Rust

// // 매 틱(Tick)마다 이 순서로 실행
// FUNCTION main_ai_loop(players: List<Player>, opponents: List<Player>, xT_Map: Grid) {

//     // --- 1. Perception (전체) ---
//     // (모든 선수가 주변 물리 상황 인지)

//     // --- 2. Decision (Pass 1 - Off-Ball) ---
//     // (공 없는 선수들이 먼저 자신의 "패스 줘!" 점수 게시) 📡
//     update_all_pass_request_scores(players, opponents, xT_Map);

//     // --- 3. Decision (Pass 2 - All Players) 🧠 ---
//     // (모든 선수가 최종 행동 결정)
//     FOR player in players {
//         let final_action: Action;

//         IF player.has_ball {
//             // 공 소유자: 2번 단계에서 '게시된' 점수를 읽고 결정
//             final_action = decide_ball_carrier_action(player, players);
//         } ELSE {
//             // 공 미소유자: '게시된' 점수가 없으니(0.0), 포지셔닝 모듈 실행
//             let best_pos = find_optimal_position(player, ...);
//             final_action = Action::Move(best_pos);
//         }

//         // --- 4. Execution (All Players) 🎮 ---
//         player.execute_action(final_action);
//     }
// }
// 이 설계는 "메시지 버스" 없이도, 선수들이 서로의 '상태'를 읽게 함으로써 매우 간단하고 효과적인 소통(패스)을 구현합니다.