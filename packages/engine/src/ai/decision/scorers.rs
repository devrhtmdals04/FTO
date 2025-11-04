use crate::ai::decision::types::{Decision, TouchOption, TouchType};
use crate::ai::perception::PerceptionSnapshot;

#[derive(Clone, Debug)]
struct TouchScore {
    option_idx: usize,
    score: f32,
}

pub fn decide_touch(s: &PerceptionSnapshot) -> Option<Decision> {
    let mut scored: Vec<TouchScore> = vec![];
    for (i, o) in s.touch_options.iter().enumerate() {
        let u = score_touch_option(o);
        scored.push(TouchScore { option_idx: i, score: u });
    }

    let best = scored.iter().max_by(|a, b| a.score.partial_cmp(&b.score).unwrap())?;
    let o = &s.touch_options[best.option_idx];

    let decision = match o.ty {
        TouchType::ReceiveToFeet => Decision::ReceiveToFeet { point: s.me.pos },
        TouchType::ReceiveInBehind => Decision::ReceiveInBehind { point: s.me.pos + o.dir },
        TouchType::Carry => Decision::Carry { dir: o.dir, speed: 0.5 },
        TouchType::DirectionalDribble => Decision::Dribble { dir: o.dir, distance: 1.0, shield: false },
        TouchType::Shield => Decision::Shield { duration_ms: 500 },
    };
    Some(decision)
}

fn score_touch_option(o: &TouchOption) -> f32 {
    // placeholder scoring logic
    let safety = 1.0 - o.p_turnover;
    o.xt_delta + safety
}
