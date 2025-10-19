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