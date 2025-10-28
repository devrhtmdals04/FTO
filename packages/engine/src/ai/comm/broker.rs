use crate::ai::PlayerId;

use super::messages::TeamMessage;

#[derive(Clone, Debug, Default)]
pub struct Inbox {
    pub messages: Vec<TeamMessage>,
}

impl Inbox {
    pub fn clear(&mut self) {
        self.messages.clear();
    }
}

#[derive(Clone, Debug, Default)]
pub struct CommBroker {
    pub outbox: Vec<TeamMessage>,
    pub inboxes: Vec<Inbox>,
}

impl CommBroker {
    pub fn enqueue(&mut self, _intent_id: u32, from: PlayerId, msg: Option<TeamMessage>) {
        if let Some(mut message) = msg {
            message.from = from;
            self.outbox.push(message);
        }
    }

    pub fn tick(&mut self, _tick: u64) {
        for message in self.outbox.drain(..) {
            for inbox in &mut self.inboxes {
                inbox.messages.push(message);
            }
        }
    }

    pub fn inbox_for(&self, local_index: usize) -> &Inbox {
        &self.inboxes[local_index]
    }

    pub fn inbox_for_mut(&mut self, local_index: usize) -> &mut Inbox {
        &mut self.inboxes[local_index]
    }
}
