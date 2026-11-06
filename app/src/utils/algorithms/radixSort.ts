export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

function countingSortByDigit(arr: number[], exp: number, steps: SortStep[], offset: number): void {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const val = arr[i] + offset;
    const digit = Math.floor(val / exp) % 10;
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i] + offset;
    const digit = Math.floor(val / exp) % 10;
    output[count[digit] - 1] = arr[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }

  steps.push({
    array: [...arr],
  });
}

export function radixSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  const min = Math.min(...arr);
  // Offset to ensure all values are non-negative for digit extraction
  const offset = min < 0 ? -min : 0;
  const max = Math.max(...arr.map((x) => x + offset));

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp, steps, offset);
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
