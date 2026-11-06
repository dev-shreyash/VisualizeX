export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function shellSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;

  if (n <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  let gap = Math.floor(n / 2);

  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      steps.push({
        array: [...arr],
        currentLeftIndex: j,
        currentRightIndex: j - gap,
        comparison: [j, j - gap],
      });

      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
        steps.push({
          array: [...arr],
          currentLeftIndex: j,
          currentRightIndex: j + gap,
          swapped: [j, j + gap],
        });
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
