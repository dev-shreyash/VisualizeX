interface SortStep {
    array: number[];
    pivot?: number;                // Current pivot index
    highlightedIndices?: number[];  // Indices to highlight (compared or swapped)
    comparison?: [number, number];  // Indices being compared
    swapped?: [number, number];     // Indices that were swapped
    sorted?: boolean;               // Indicates if the array is fully sorted
  }
  
  export function quickSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
  
    function partition(arr: number[], low: number, high: number): number {
      const pivot = arr[high];
      let i = low - 1;
  
      for (let j = low; j < high; j++) {
        // Record comparison step with highlighted indices
        steps.push({
          array: [...arr],
          pivot: high,
          comparison: [j, high],
          highlightedIndices: [j, high], // Highlight the indices being compared
        });
  
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
  
          // Record swap step
          steps.push({
            array: [...arr],
            swapped: [i, j],
            highlightedIndices: [i, j], // Highlight the swapped indices
          });
        }
      }
  
      // Swap pivot element to its correct position
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  
      // Record swap step for pivot
      steps.push({
        array: [...arr],
        swapped: [i + 1, high],
        highlightedIndices: [i + 1, high], // Highlight the pivot swap
      });
  
      return i + 1; // Return the pivot index
    }
  
    function sort(arr: number[], low: number, high: number): void {
      if (low < high) {
        const pi = partition(arr, low, high);
  
        // Recursively sort left and right partitions
        sort(arr, low, pi - 1);
        sort(arr, pi + 1, high);
      }
    }
  
    const arr = [...array]; // Clone the array to avoid mutation
    sort(arr, 0, arr.length - 1);
  
    // Final sorted state
    steps.push({ array: [...arr], sorted: true });
  
    return steps;
  }
  