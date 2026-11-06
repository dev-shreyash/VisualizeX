export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function pancakeSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  const flip = (n: number): void => {
    let start = 0;
    while (start < n) {
      [arr[start], arr[n]] = [arr[n], arr[start]];
      start++;
      n--;
    }
  };

  const findMax = (n: number): number => {
    let maxIdx = 0;
    for (let i = 1; i < n; i++) {
      if (arr[i] > arr[maxIdx]) {
        maxIdx = i;
      }
    }
    return maxIdx;
  };

  for (let size = arr.length; size > 1; size--) {
    const maxIdx = findMax(size);
    if (maxIdx !== size - 1) {
      if (maxIdx > 0) {
        flip(maxIdx);
        steps.push({
          array: [...arr],
          currentLeftIndex: 0,
          currentRightIndex: maxIdx,
          swapped: [0, maxIdx],
        });
      }

      flip(size - 1);
      steps.push({
        array: [...arr],
        currentLeftIndex: 0,
        currentRightIndex: size - 1,
        swapped: [0, size - 1],
      });
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
