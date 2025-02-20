interface SortStep {
  array: number[];
  currentLeftIndex?: number;   // Current index being processed from the left side
  currentRightIndex?: number;  // Current index being processed from the right side
  comparison?: [number, number]; // Indices being compared
  swapped?: [number, number];    // Indices that were swapped
  sorted?: boolean;              // Indicates if the array is fully sorted
}

export function bubbleSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array]; // Clone the array to avoid mutation

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Record the current step with highlighted indices for comparison
      steps.push({
        array: [...arr],
        currentLeftIndex: j,       // Left index being processed
        currentRightIndex: j + 1,  // Right index being processed
        comparison: [j, j + 1], // Indices being compared
      });

      // Check if the current element is greater than the next element
      

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        // Record the step with swapped indices
        steps.push({
          array: [...arr],
          swapped: [j, j + 1], // Indices that were swapped
        });
      }
    }
  }

  // Final state indicating the array is sorted
  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
