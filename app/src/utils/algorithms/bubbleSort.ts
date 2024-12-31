interface SortStep {
  array: number[];
  highlightedIndices?: number[]; // Indices to highlight
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
        highlightedIndices: [j, j + 1],
      });

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        // Record the step with highlighted indices for swap
        steps.push({
          array: [...arr],
          highlightedIndices: [j, j + 1],
        });
      }
    }
  }

  // Final state indicating the array is sorted
  steps.push({ 
    array: [...arr], 
    highlightedIndices: [], // No specific indices to highlight in the sorted state
    sorted: true,
  });

  return steps;
}
