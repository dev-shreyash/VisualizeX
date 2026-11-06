export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  pivot?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function selectionSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;

    steps.push({
      array: [...arr],
      currentLeftIndex: i,
      currentRightIndex: minIndex,
      comparison: [i, minIndex],
    });

    for (let j = i + 1; j < arr.length; j++) {
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: j,
        comparison: [minIndex, j],
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: minIndex,
        swapped: [i, minIndex],
      });
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
