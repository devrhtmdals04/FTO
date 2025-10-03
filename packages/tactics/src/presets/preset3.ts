import { createEmptyTactic, Tactic } from '../models/tactic';

const preset3 = (() => {
  const base = createEmptyTactic('preset3');
  return {
    ...base,
    id: 'preset-3',
  } satisfies Tactic;
})();

export default preset3;
