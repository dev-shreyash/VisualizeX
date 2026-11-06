export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function bubbleSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push({
        array: [...arr],
        currentLeftIndex: j,
        currentRightIndex: j + 1,
        comparison: [j, j + 1],
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          currentLeftIndex: j,
          currentRightIndex: j + 1,
          swapped: [j, j + 1],
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
