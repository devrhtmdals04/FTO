## this is perception module. this is seperated by three. profile, essential, functional, deeper.

get_own_profileandrole(){
    role = getrole()
    profile = getprofile()
}

## 1. essential function. this function will be called every tick. 

essential(){
    ball;
    self;
    teammates;
    opponents;
    elements; (goalposition, panaltibox, sideline)
}

## 2. functional function. this function will be called specific tick.

functional(){
    pass_possibility;
    shot_possibility;
    tackle_possipility;
    intercept_possibility;
    dribble_awareness;
    valuable_space;
}

## 3. deep function. this fuction will be called few tick. massive calculate needed.

deepfunction(){
    predictplayermove;
}

