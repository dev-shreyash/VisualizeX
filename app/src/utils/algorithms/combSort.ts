export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function combSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  let gap = arr.length;
  let swapped = true;

  while (gap > 1 || swapped) {
    gap = Math.floor(gap / 1.3);
    if (gap < 1) gap = 1;
    swapped = false;

    for (let i = 0; i + gap < arr.length; i++) {
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: i + gap,
        comparison: [i, i + gap],
      });

      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        swapped = true;
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i + gap,
          swapped: [i, i + gap],
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
