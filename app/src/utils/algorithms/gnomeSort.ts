export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function gnomeSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  let i = 0;
  while (i < arr.length) {
    if (i === 0 || arr[i] >= arr[i - 1]) {
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: i > 0 ? i - 1 : 0,
        comparison: [i, i > 0 ? i - 1 : 0],
      });
      i++;
    } else {
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: i - 1,
        swapped: [i, i - 1],
      });
      i--;
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
