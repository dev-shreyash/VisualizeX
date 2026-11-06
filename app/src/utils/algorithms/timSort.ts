export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

function insertionSortRange(arr: number[], left: number, right: number, steps: SortStep[]): void {
  for (let i = left + 1; i <= right; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > key) {
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
}

function mergeRanges(arr: number[], left: number, mid: number, right: number, steps: SortStep[]): void {
  const leftArr = arr.slice(left, mid + 1);
  const rightArr = arr.slice(mid + 1, right + 1);

  let i = 0;
  let j = 0;
  let k = left;

  while (i < leftArr.length && j < rightArr.length) {
    steps.push({
      array: [...arr],
      currentLeftIndex: left + i,
      currentRightIndex: mid + 1 + j,
      comparison: [left + i, mid + 1 + j],
    });

    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i++];
    } else {
      arr[k] = rightArr[j++];
    }
    steps.push({
      array: [...arr],
      currentLeftIndex: k,
    });
    k++;
  }

  while (i < leftArr.length) {
    arr[k] = leftArr[i++];
    steps.push({
      array: [...arr],
      currentLeftIndex: k,
    });
    k++;
  }

  while (j < rightArr.length) {
    arr[k] = rightArr[j++];
    steps.push({
      array: [...arr],
      currentRightIndex: k,
    });
    k++;
  }
}

export function timSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;

  if (n <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  const RUN = 32;

  // Sort individual subarrays of size RUN
  for (let i = 0; i < n; i += RUN) {
    insertionSortRange(arr, i, Math.min(i + RUN - 1, n - 1), steps);
  }

  // Start merging from size RUN
  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);

      if (mid < right) {
        mergeRanges(arr, left, mid, right, steps);
      }
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
