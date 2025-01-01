interface SortStep {
  array: number[];
  highlightedIndices?: number[]; // Indices to highlight
  merged?: [number, number];     // Range of indices being merged
  sorted?: boolean;              // Indicates if the array is fully sorted
  pivot?: number;                // The pivot point (for visualization)
}

export function mergeSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];

  function merge(arr: number[], left: number, mid: number, right: number): void {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArray.length && j < rightArray.length) {
      // Record comparison step with highlighted indices
      steps.push({
        array: [...arr],
        highlightedIndices: [k, k + 1], // Highlight indices being compared
      });

      if (leftArray[i] <= rightArray[j]) {
        arr[k++] = leftArray[i++];
      } else {
        arr[k++] = rightArray[j++];
      }
    }

    // Add remaining elements from left array
    while (i < leftArray.length) {
      steps.push({
        array: [...arr],
        highlightedIndices: [k], // Highlight the single index being added
      });
      arr[k++] = leftArray[i++];
    }

    // Add remaining elements from right array
    while (j < rightArray.length) {
      steps.push({
        array: [...arr],
        highlightedIndices: [k], // Highlight the single index being added
      });
      arr[k++] = rightArray[j++];
    }

    // Record merged step with range
    steps.push({
      array: [...arr],
      highlightedIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx), // Highlight the merged range
      merged: [left, right],
    });
  }

  function sort(arr: number[], left: number, right: number): void {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Highlight the mid index as the "pivot" during each division
    steps.push({
      array: [...arr],
      highlightedIndices: [mid], // Highlight the mid index as the pivot
      pivot: mid,               // Mark the pivot for visualization
    });

    sort(arr, left, mid);
    sort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  const arr = [...array];
  sort(arr, 0, arr.length - 1);

  steps.push({
    array: [...arr],
    highlightedIndices: [], // No specific indices to highlight
    sorted: true,
  });

  return steps;
}
