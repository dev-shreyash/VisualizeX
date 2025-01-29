interface SortStep {
    array: number[];
    currentLeftIndex?: number;     // Current index of the element being compared/inserted/swapped
    currentRightIndex?: number;    // Current index of the comparison
    comparison?: [number, number]; // Indices being compared
    swapped?: [number, number];    // Indices that were swapped
    sorted?: boolean;              // Indicates if the array is fully sorted
  }
  
  export function gnomeSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
    let i = 0;
  
    // Loop through the array to perform sorting
    while (i < arr.length) {
      if (i === 0 || arr[i] >= arr[i - 1]) {
        // No swap needed, just move forward
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i - 1,
          comparison: [i, i - 1], // Compare with the previous element
        });
        i++; // Move forward
      } else {
        // Swap the elements
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i - 1,
          comparison: [i, i - 1], // Compare with the previous element
        });
        
        // Perform the swap
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
        
        steps.push({
          array: [...arr],
          swapped: [i, i - 1], // Swapped indices
        });
  
        i--; // Move backward to recheck the order
      }
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  