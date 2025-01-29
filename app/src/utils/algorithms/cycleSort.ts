interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  export function cycleSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    const n = arr.length;
  
    // Perform Cycle Sort
    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
      let item = arr[cycleStart];
  
      // Find the position where we put the element
      let pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (arr[i] < item) {
          pos++;
        }
      }
  
      // If the element is already in the correct position
      if (pos === cycleStart) continue;
  
      // Otherwise, put the element to the correct position
      while (item === arr[pos]) {
        pos++;
      }
      [arr[pos], item] = [item, arr[pos]];
  
      steps.push({
        array: [...arr],
        swapped: [pos, cycleStart],
      });
  
      // Rotate the remaining elements
      while (pos !== cycleStart) {
        pos = cycleStart;
  
        // Find the position of the element
        for (let i = cycleStart + 1; i < n; i++) {
          if (arr[i] < item) {
            pos++;
          }
        }
  
        // Put the element to the correct position
        while (item === arr[pos]) {
          pos++;
        }
        [arr[pos], item] = [item, arr[pos]];
  
        steps.push({
          array: [...arr],
          swapped: [pos, cycleStart],
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
  