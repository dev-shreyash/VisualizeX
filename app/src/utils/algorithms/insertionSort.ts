export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function insertionSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      currentLeftIndex: i,
      currentRightIndex: j,
      comparison: [j, i],
    });

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        currentLeftIndex: j,
        currentRightIndex: j + 1,
        swapped: [j, j + 1],
      });
      j--;
    }
    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      currentLeftIndex: j + 1,
      currentRightIndex: i,
    });
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
