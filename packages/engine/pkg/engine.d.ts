/* tslint:disable */
/* eslint-disable */
export function start(): void;
export class WasmEngine {
  free(): void;
  constructor(seed: bigint);
  tick(): void;
  set_ai_active(player_index: number, active: boolean): void;
  snapshot(): Uint8Array;
  delta(): Uint8Array;
  command(cmd: any): void;
  getPlayerDataJson(): string;
  view(): Uint8Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmengine_free: (a: number, b: number) => void;
  readonly wasmengine_new: (a: bigint) => number;
  readonly wasmengine_tick: (a: number) => void;
  readonly wasmengine_set_ai_active: (a: number, b: number, c: number) => void;
  readonly wasmengine_snapshot: (a: number) => [number, number];
  readonly wasmengine_delta: (a: number) => [number, number];
  readonly wasmengine_command: (a: number, b: any) => void;
  readonly wasmengine_getPlayerDataJson: (a: number) => [number, number];
  readonly wasmengine_view: (a: number) => [number, number];
  readonly start: () => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
