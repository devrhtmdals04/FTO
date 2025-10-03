import { createEmptyTactic, Tactic } from '../models/tactic';

const preset1 = (() => {
  const base = createEmptyTactic('preset1');
  return {
    ...base,
    id: 'preset-1',
  } satisfies Tactic;
})();

export default preset1;
