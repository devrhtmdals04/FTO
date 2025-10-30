use crate::ai::{EngineCmd, EngineCmdSink};

pub struct LoggingSink<'a> {
    pub inner: &'a mut dyn EngineCmdSink,
    pub tick: u64,
}

impl<'a> EngineCmdSink for LoggingSink<'a> {
    fn push(&mut self, cmd: EngineCmd) {
        self.inner.push(cmd);
    }
}
