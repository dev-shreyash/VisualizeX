interface SortStep {
    array: number[];
    currentLeftIndex?: number;     // Current index of the element being compared/inserted/swapped
    currentRightIndex?: number;    // Current index of the comparison
    comparison?: [number, number]; // Indices being compared
    swapped?: [number, number];    // Indices that were swapped
    sorted?: boolean;              // Indicates if the array is fully sorted
  }
  
  export function combSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
    let gap = arr.length;
    let swapped = true;
  
    // Keep reducing the gap until it becomes 1
    while (gap > 1 || swapped) {
      // Update the gap using shrink factor (commonly 1.3)
      gap = Math.floor(gap / 1.3);
  
      swapped = false;
  
      // Perform the comparison and possible swap for the current gap
      for (let i = 0; i + gap < arr.length; i++) {
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i + gap,
          comparison: [i, i + gap], // Compare the current element with the element 'gap' positions ahead
        });
  
        // If elements are out of order, swap them
        if (arr[i] > arr[i + gap]) {
          // Swap the elements
          [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
  
          steps.push({
            array: [...arr],
            swapped: [i, i + gap], // Indices of the swapped elements
          });
  
          swapped = true;
        }
      }
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  