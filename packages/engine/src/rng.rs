use rand::RngCore;
use rand::SeedableRng;
use rand_pcg::Pcg32;

#[derive(Clone)]
pub struct DeterministicRng {
    inner: Pcg32,
}

impl DeterministicRng {
    pub fn new(seed: u64) -> Self {
        Self {
            inner: Pcg32::seed_from_u64(seed),
        }
    }

    pub fn from_parts(state: u64, stream: u64) -> Self {
        Self {
            inner: Pcg32::new(state, stream),
        }
    }

    pub fn next_u32(&mut self) -> u32 {
        self.inner.next_u32()
    }

    pub fn next_f32(&mut self) -> f32 {
        let bits = self.next_u32();
        (bits as f32) / (u32::MAX as f32)
    }

    pub fn fill_bytes(&mut self, dest: &mut [u8]) {
        self.inner.fill_bytes(dest);
    }

    pub fn as_mut(&mut self) -> &mut Pcg32 {
        &mut self.inner
    }
}

impl rand::SeedableRng for DeterministicRng {
    type Seed = <Pcg32 as rand::SeedableRng>::Seed;

    fn from_seed(seed: Self::Seed) -> Self {
        Self {
            inner: Pcg32::from_seed(seed),
        }
    }
}

impl RngCore for DeterministicRng {
    fn next_u32(&mut self) -> u32 {
        self.inner.next_u32()
    }

    fn next_u64(&mut self) -> u64 {
        self.inner.next_u64()
    }

    fn fill_bytes(&mut self, dest: &mut [u8]) {
        self.inner.fill_bytes(dest);
    }

    fn try_fill_bytes(&mut self, dest: &mut [u8]) -> Result<(), rand::Error> {
        self.inner.try_fill_bytes(dest)
    }
}
