import * as wasm from "./engine_bg.wasm";
export * from "./engine_bg.js";
import { __wbg_set_wasm } from "./engine_bg.js";
__wbg_set_wasm(wasm);
wasm.__wbindgen_start();
