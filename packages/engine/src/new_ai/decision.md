## this is decision module. the module will decide final action.

call_perception_essential();
get_team_phase();

if kickoff or setpiece:
    do kickoff or setpiece;
else:
    if buildup:
        makedecision(buildup);
    if progression:
        makedecision(progression);
    if finalthird:
        makedecision(finalthird);
    if highblock:
        makedecision(highblock);
    if midblock:
        makedecision(midblock);
    if lowblock:
        makedecision(lowblock);

makedecision(phase){
    decision = max(position, pass, dribble, shot, tackle, intercept);
    do decision;
}

