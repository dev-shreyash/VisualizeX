export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

function insertionSortSubarray(arr: number[], steps: SortStep[]): void {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}

export function bucketSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  const max = Math.max(...arr);
  const min = Math.min(...arr);

  // Zero range edge case: all elements are identical
  if (max === min) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  const bucketCount = Math.max(1, Math.floor(Math.sqrt(arr.length)));
  const bucketRange = (max - min) / bucketCount;

  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  for (const num of arr) {
    const index = Math.min(
      Math.floor((num - min) / bucketRange),
      bucketCount - 1
    );
    buckets[index].push(num);
  }

  // Sort each bucket and record progress steps
  let flatIndex = 0;
  for (let b = 0; b < buckets.length; b++) {
    insertionSortSubarray(buckets[b], steps);
    for (const num of buckets[b]) {
      arr[flatIndex++] = num;
      steps.push({
        array: [...arr],
        currentRightIndex: flatIndex - 1,
      });
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
