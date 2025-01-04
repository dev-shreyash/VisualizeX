interface SortStep {
    array: number[];
    currentLeftIndex?: number;     // Current index of the element being inserted
    currentRightIndex?: number;    // Current index of comparison
    comparison?: [number, number]; // Indices being compared
    swapped?: [number, number];    // Indices that were swapped
    sorted?: boolean;              // Indicates if the array is fully sorted
  }
  
  export function insertionSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
  
      // Record the initial position of the key
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: j,
        comparison: [j, i],
      });
  
      // Move elements of arr[0..i-1] that are greater than key to one position ahead
      while (j >= 0 && arr[j] > key) {
        // Record comparison step
        steps.push({
          array: [...arr],
          currentLeftIndex: j,
          currentRightIndex: j + 1,
          comparison: [j, j + 1],
        });
  
        arr[j + 1] = arr[j]; // Shift element
  
        // Record shifting step
        steps.push({
          array: [...arr],
          swapped: [j, j + 1],
        });
  
        j--;
      }
  
      arr[j + 1] = key; // Insert key into the correct position
  
      // Record insertion step
      steps.push({
        array: [...arr],
        currentLeftIndex: j + 1,
        currentRightIndex: i,
        swapped: [j + 1, i], // The key was inserted at this index
      });
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  