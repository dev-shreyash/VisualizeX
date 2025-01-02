interface SortStep {
  array: number[];
  currentLeftIndex?: number;     // Current index of the left pointer
  currentRightIndex?: number;    // Current index of the right pointer
  pivot?: number;                // The pivot index
  comparison?: [number, number]; // Indices being compared
  swapped?: [number, number];    // Indices that were swapped
  sorted?: boolean;              // Indicates if the array is fully sorted
}

  
export function quickSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];

  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Record comparison step
      steps.push({
        array: [...arr],
        pivot: high,
        currentLeftIndex: i + 1,
        currentRightIndex: j,
        comparison: [i + 1, j], // Indices being compared
      });

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements

        // Record swap step
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: j,
          swapped: [i, j], // Indices that were swapped
        });
      }
    }

    // Swap pivot element to its correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    // Record swap step for pivot
    steps.push({
      array: [...arr],
      currentLeftIndex: i + 1,
      currentRightIndex: high,
      swapped: [i + 1, high], // Pivot swap
    });

    return i + 1; // Return the pivot index
  }

  function sort(arr: number[], low: number, high: number): void {
    if (low < high) {
      const pi = partition(arr, low, high);

      // Record comparison step after partitioning
      steps.push({
        array: [...arr],
        comparison: [low, high], // Indices compared during partitioning
      });

      // Recursively sort left and right partitions
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    }
  }

  const arr = [...array]; // Clone the array to avoid mutation
  sort(arr, 0, arr.length - 1);

  // Final sorted state
  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}

  