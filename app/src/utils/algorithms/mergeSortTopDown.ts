interface SortStep {
  array: number[];
  currentLeftIndex?: number; // Current index of the left array being processed
  currentRightIndex?: number; // Current index of the right array being processed
  comparison?: [number, number]; // Indices being compared
  swapped?: [number, number]; // Indices that were swapped
  merged?: [number, number]; // Range of indices being merged
  sorted?: boolean; // Indicates if the array is fully sorted
  pivot?: number; // The pivot point (for visualization)
}

export function mergeSortTopDown(array: number[]): SortStep[] {
  const steps: SortStep[] = [];

  function merge(arr: number[], left: number, mid: number, right: number): void {
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);

    let i = 0,
      j = 0,
      k = left;

    while (i < leftArray.length && j < rightArray.length) {
      // Record comparison step with separate indices
      steps.push({
        array: [...arr],
        comparison: [left + i, mid + 1 + j], // Highlight the indices being compared
        currentLeftIndex: left + i, // Left index being processed
        currentRightIndex: mid + 1 + j, // Right index being processed
      });

      if (leftArray[i] <= rightArray[j]) {
        arr[k++] = leftArray[i++];
        // Record swapped step
        steps.push({
          array: [...arr],
          swapped: [k - 1, left + i - 1], // Highlight the swapped indices
        });
      } else {
        arr[k++] = rightArray[j++];
        // Record swapped step
        steps.push({
          array: [...arr],
          swapped: [k - 1, mid + 1 + j - 1], // Highlight the swapped indices
        });
      }
    }

    // Add remaining elements from left array
    while (i < leftArray.length) {
      steps.push({
        array: [...arr],
        currentLeftIndex: left + i, // Highlight the current left index
      });
      arr[k++] = leftArray[i++];
    }

    // Add remaining elements from right array
    while (j < rightArray.length) {
      steps.push({
        array: [...arr],
        currentRightIndex: mid + 1 + j, // Highlight the current right index
      });
      arr[k++] = rightArray[j++];
    }

    // Record merged step with range
    steps.push({
      array: [...arr],
      merged: [left, right],
    });
  }

  function sort(arr: number[], left: number, right: number): void {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Highlight the mid index during each division
    steps.push({
      array: [...arr],
      pivot: mid, // Mark the pivot for visualization
    });

    sort(arr, left, mid);
    sort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }

  const arr = [...array];
  sort(arr, 0, arr.length - 1);

  // Final sorted state
  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
