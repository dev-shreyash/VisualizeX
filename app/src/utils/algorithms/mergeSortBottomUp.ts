export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  merged?: [number, number];
  sorted?: boolean;
}

export function mergeSortBottomUp(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;

  if (n <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  function merge(left: number, mid: number, right: number): void {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
      steps.push({
        array: [...arr],
        comparison: [left + i, mid + 1 + j],
        currentLeftIndex: left + i,
        currentRightIndex: mid + 1 + j,
      });

      if (leftArray[i] <= rightArray[j]) {
        arr[k++] = leftArray[i++];
      } else {
        arr[k++] = rightArray[j++];
      }
      steps.push({
        array: [...arr],
        swapped: [k - 1, k - 1],
      });
    }

    while (i < leftArray.length) {
      arr[k++] = leftArray[i++];
      steps.push({
        array: [...arr],
        swapped: [k - 1, k - 1],
      });
    }

    while (j < rightArray.length) {
      arr[k++] = rightArray[j++];
      steps.push({
        array: [...arr],
        swapped: [k - 1, k - 1],
      });
    }
  }

  for (let currSize = 1; currSize < n; currSize = 2 * currSize) {
    for (let left = 0; left < n - 1; left += 2 * currSize) {
      const mid = Math.min(left + currSize - 1, n - 1);
      const right = Math.min(left + 2 * currSize - 1, n - 1);
      if (mid < right) {
        merge(left, mid, right);
      }
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
