interface SortStep {
    array: number[];
    currentLeftIndex?: number;     // Current index of the left pointer
    currentRightIndex?: number;    // Current index of the right pointer
    pivot?: number;                // The pivot index (not applicable for selection sort)
    comparison?: [number, number]; // Indices being compared
    swapped?: [number, number];    // Indices that were swapped
    sorted?: boolean;              // Indicates if the array is fully sorted
  }
  
  export function selectionSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
  
      // Record initial step
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: minIndex,
        comparison: [i, minIndex],
      });
  
      // Find the minimum element in the remaining unsorted array
      for (let j = i + 1; j < arr.length; j++) {
        // Record comparison step
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: j,
          comparison: [minIndex, j],
        });
  
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
  
          // Record when a new minimum is found
          steps.push({
            array: [...arr],
            currentLeftIndex: i,
            currentRightIndex: minIndex,
          });
        }
      }
  
      // Swap the found minimum element with the first element
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  
        // Record swap step
        steps.push({
          array: [...arr],
          swapped: [i, minIndex],
        });
      }
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  