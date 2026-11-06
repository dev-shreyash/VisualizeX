export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function oddEvenSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;

  if (n <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  let sorted = false;

  while (!sorted) {
    sorted = true;

    // Odd phase
    for (let i = 1; i < n - 1; i += 2) {
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: i + 1,
        comparison: [i, i + 1],
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i + 1,
          swapped: [i, i + 1],
        });
        sorted = false;
      }
    }

    // Even phase
    for (let i = 0; i < n - 1; i += 2) {
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: i + 1,
        comparison: [i, i + 1],
      });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i + 1,
          swapped: [i, i + 1],
        });
        sorted = false;
      }
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
