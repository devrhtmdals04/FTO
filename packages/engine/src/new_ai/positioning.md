## this module calculates 'best position' for one's player.

using xt(expected threat), findspace(perception), tactic(formation_data etc.) 

# only calculate adjacent pos.
perception::findspace(curpos){
    return spacescore;
}

get_tactic_data(teamphase){
    return tacticscore
}

bestposition = (xtscore * xtweight) + (spacescore * spaceweight) + (tacticscore * tacticweight) 

make_noise(bestposiotion, ownpositioningstatus){
    return pos;
}

# makeformation use in kickoff and setpiece phase.
makeformation(tactic){
    parse(tactic);
    adjusted_formation(kickoffAttack);
    adjusted_formation(kickoffDeffence);
    adjusted_formation(setpieceAttack);
    adjusted_formation(setpieceDeffence);
}

