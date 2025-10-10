const weightedRandom = (choices: any[], weights: number[]) => {
  const weightsValue = weights.reduce((acc, value) => acc + value, 0);
  const roll = Math.random() * weightsValue;
  return choices[
    weights
      .reduce<number[]>((acc, value, i) => {
        if (i === 0) {
          return [value];
        } else {
          return [...acc, acc[acc.length - 1] + value];
        }
      }, [])
      .findIndex(
        (weight, i, weightsTab) =>
          roll >= (i === 0 ? 0 : weightsTab[i - 1]) && roll < weight
      )
  ];
};

export const updateChoiceWeight = (
  oldTab: number[],
  idx: number,
  newValue: number
): number[] => [...oldTab.slice(0, idx), newValue, ...oldTab.slice(idx + 1)];

const testRandom = () => {
  const choices = [3, 7, 9, 11];
  const weights = [0.1, 0.6, 0.6, 0.1];

  const resultTab = [];

  for (let i = 0; i < 100; i++) {
    resultTab.push(weightedRandom(choices, weights));
  }

  const sortResult = resultTab.reduce(
    (acc, val) => {
      const result = { ...acc };
      result[val]++;
      return result;
    },
    { 3: 0, 7: 0, 9: 0, 11: 0 }
  );
  return sortResult;
};

export const convertPercent = (tab) => {
  const total = tab.reduce((acc, curr) => acc + curr, 0);
  return tab.map((val) => Math.round((val * 100) / total));
};

export default weightedRandom;
