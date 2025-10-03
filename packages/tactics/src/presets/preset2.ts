import { createEmptyTactic, Tactic } from '../models/tactic';

const preset2 = (() => {
  const base = createEmptyTactic('preset2');
  return {
    ...base,
    id: 'preset-2',
  } satisfies Tactic;
})();

export default preset2;
