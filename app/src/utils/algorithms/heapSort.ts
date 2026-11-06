export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

function heapify(arr: number[], n: number, i: number, steps: SortStep[]): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    steps.push({
      array: [...arr],
      currentLeftIndex: i,
      currentRightIndex: largest,
      swapped: [i, largest],
    });
    heapify(arr, n, largest, steps);
  }
}

export function heapSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;

  if (n <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, steps);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    steps.push({
      array: [...arr],
      currentLeftIndex: 0,
      currentRightIndex: i,
      swapped: [0, i],
    });
    heapify(arr, i, 0, steps);
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
