import init, { WasmEngine } from "../pkg/engine.js";

async function run() {
  await init();

  const engine = new WasmEngine(42n);

  for (let i = 0; i < 20; i += 1) {
    engine.tick();
  }

  const snapshot = engine.snapshot();
  const delta = engine.delta();

  const info = `Snapshot bytes: ${snapshot.length}\nDelta bytes: ${delta.length}`;
  const output = document.getElementById("output");
  if (output) {
    output.textContent = info;
  }
  console.log(info);
}

run().catch((err) => {
  console.error("Failed to run WASM engine", err);
});
