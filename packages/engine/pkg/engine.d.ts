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
