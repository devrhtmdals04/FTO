the simulation logic example.

1. First. get an tactic data. (home and away.)
tactic data example:

{
formation: 4-4-2(deffensive), 3241(offensive)
role: GK, LB, LCB, RCB, RB, LM, LCM, RCM, RM, LF, RF
lineup: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 (player profile id. in order to role.)
teamtactic:
    teamattacking:
        buildupphase: buildupformation, goalkeeperengage, passdistance
        finalthirdphase: finalthirdformation, attackpreference, crossfrequency, over-underlappingplayer
    teamtransition:
        getball: inposition or counterattack
        looseball: backposition or counterpress
    teamdeffending:
        deffensingformation,
        highblock: pressing or makeblock
        midblock: pressing or makeblock
        lowblock: blockmiddle or blockside
    teamsetpiece:
        attackcorner:
        deffencecorner:
    personalinstructions:
        playerid:
            1: GK, buildupintensity, coverradius, riskintensity:
            2: LB, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            3: LCB, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            4: RCB, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            5: RB, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            6: LM, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            7: LCM. riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            8: RCM. riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            9: RM, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            10: LF, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
            11: RF, riskintensity, deffenseparticipation, attackingparticipation, markmanid, deffenseposition, attackingposition
}

2. Two, quantification tactic.
3. Third, adjust to ai.
4. Four, make playerclass object with the ai.
playerclass example:
    adjusted ai module,
    playerprofiledata,
    playerstate,
    teamstate,
    position,
    etc.

5. Five, repeat Fourth progress until all the existing player made.
6. Six, Run Simulation.


1. JSON → Tactic 파싱
      - engine/src/engine.rs에서 하드코딩된 더미 JSON 문자열(또는 나중에 커맨드를 통해 들어오는 JSON 문자열)이 tactics::load_tactic_from_json으로 전달됩
        니다.
      - load_tactic_from_json(json_data: &str) -> Result<Tactic, serde_json::Error>는 serde_json::from_str만 호출하는 래퍼입니다.
        이때 결과는 types.rs에 정의된 Tactic 구조체(공격/수비 포메이션 문자열, roles: Vec<DetailedPlayerRole>, lineup: Vec<u32>, TeamTactic,
        personal_instructions 등)와 하위 타입들(TeamAttacking, TeamDefending, PlayerInstruction…)에 자동 매핑됩니다.
  2. 정량화(Tactic → QuantifiedTactics)
      - 파싱한 Tactic을 tactics::quantify에 넣어 QuantifiedTactics로 변환합니다.
      - 이 단계는 엔진·AI에서 즉시 사용하기 쉽도록 전술을 간단한 실수값으로 정규화하는 전처리 역할입니다. (다만 문자열/포메이션 등 다른 정보는 여기서 반
        영되지 않습니다.)
  3. Engine 내부 상태로 흘려보내기
      - Engine::rebuild_tactical_state에서 world.initialize_params를 호출해 각 팀 라인업 ID(예: [1,2,…,11])에 맞춰 선수 능력치를 설정합니다.
      - 동시에 QuantifiedTactics는 world.tactics와 team_tactics에 저장되며, 팀 컨텍스트(TeamCtx)에 복사되어 AI가 참조할 수 있는 형태로 준비됩니다.
      - personal_instructions, role 매칭 등 세부 전술 정보는 TacticModel을 통해 필요 시 조회합니다.
  4. AI 단계에서의 활용
      - 매 틱마다 Engine::update_ai → AiScheduler::tick → PlayerAgent::decision/execution 순으로 새 파이프라인이 실행됩니다.
      - 아직 Decision/Execution 모듈에 전술 수치를 반영하는 로직은 TODO 상태이므로, QuantifiedTactics 및 개인 지시를 활용한 세부 전략은 계속 확장해야 합니다.

  정리하면, JSON 문자열 → Tactic → QuantifiedTactics → world & TeamCtx까지 값이 전달되는 파이프라인은 이미 마련되어 있고, 실제로 AI 행동에 반영하는
  로직만 채워 넣으면 됩니다.
