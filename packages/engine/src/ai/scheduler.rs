use crate::params::AI_REEVAL_PERIOD;

#[derive(Default)]
pub struct Scheduler {
    tick: u32,
}

impl Scheduler {
    pub fn new() -> Self {
        Self { tick: 0 }
    }

    pub fn step(&mut self) {
        self.tick = self.tick.wrapping_add(1);
    }

    pub fn should_evaluate(&self, player_index: usize) -> bool {
        (player_index as u32 + self.tick) % AI_REEVAL_PERIOD == 0
    }
}
