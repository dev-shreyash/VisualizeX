interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  export function oddEvenSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    let sorted = false;
    let n = arr.length;
  
    while (!sorted) {
      sorted = true;
  
      // Odd phase
      for (let i = 1; i < n - 1; i += 2) {
        // Compare adjacent odd and even indexed elements
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i + 1,
          comparison: [i, i + 1],
        });
  
        if (arr[i] > arr[i + 1]) {
          // Swap if they are in the wrong order
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          steps.push({
            array: [...arr],
            swapped: [i, i + 1],
          });
  
          sorted = false;
        }
      }
  
      // Even phase
      for (let i = 0; i < n - 1; i += 2) {
        // Compare adjacent even and odd indexed elements
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: i + 1,
          comparison: [i, i + 1],
        });
  
        if (arr[i] > arr[i + 1]) {
          // Swap if they are in the wrong order
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
          steps.push({
            array: [...arr],
            swapped: [i, i + 1],
          });
  
          sorted = false;
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
  