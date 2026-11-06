export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

const INSERTION_SORT_THRESHOLD = 16;

function insertionSortRange(arr: number[], left: number, right: number, steps: SortStep[]): void {
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > key) {
      arr[j + 1] = arr[j];
      steps.push({ array: [...arr], swapped: [j, j + 1] });
      j--;
    }
    arr[j + 1] = key;
    steps.push({ array: [...arr] });
  }
}

function heapifySubrange(arr: number[], low: number, n: number, i: number, steps: SortStep[]): void {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[low + left] > arr[low + largest]) {
    largest = left;
  }
  if (right < n && arr[low + right] > arr[low + largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[low + i], arr[low + largest]] = [arr[low + largest], arr[low + i]];
    steps.push({ array: [...arr], swapped: [low + i, low + largest] });
    heapifySubrange(arr, low, n, largest, steps);
  }
}

function heapSortRange(arr: number[], low: number, high: number, steps: SortStep[]): void {
  const n = high - low + 1;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifySubrange(arr, low, n, i, steps);
  }
  for (let i = n - 1; i > 0; i--) {
    [arr[low], arr[low + i]] = [arr[low + i], arr[low]];
    steps.push({ array: [...arr], swapped: [low, low + i] });
    heapifySubrange(arr, low, i, 0, steps);
  }
}

function partition(arr: number[], low: number, high: number, steps: SortStep[]): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    steps.push({ array: [...arr], comparison: [j, high] });
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      steps.push({ array: [...arr], swapped: [i, j] });
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  steps.push({ array: [...arr], swapped: [i + 1, high] });
  return i + 1;
}

function introsortUtil(arr: number[], low: number, high: number, depthLimit: number, steps: SortStep[]): void {
  const size = high - low + 1;
  if (size <= 1) return;

  if (size < INSERTION_SORT_THRESHOLD) {
    insertionSortRange(arr, low, high, steps);
    return;
  }

  if (depthLimit === 0) {
    heapSortRange(arr, low, high, steps);
    return;
  }

  const pivot = partition(arr, low, high, steps);
  introsortUtil(arr, low, pivot - 1, depthLimit - 1, steps);
  introsortUtil(arr, pivot + 1, high, depthLimit - 1, steps);
}

export function introspectiveSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  const depthLimit = 2 * Math.floor(Math.log2(arr.length));
  introsortUtil(arr, 0, arr.length - 1, depthLimit, steps);

  steps.push({ array: [...arr], sorted: true });
  return steps;
}
