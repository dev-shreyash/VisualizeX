interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  export function pancakeSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    const flip = (n: number): void => {
      let start = 0;
      while (start < n) {
        [arr[start], arr[n]] = [arr[n], arr[start]];
        start++;
        n--;
      }
    };
  
    const findMax = (n: number): number => {
      let maxIdx = 0;
      for (let i = 1; i < n; i++) {
        if (arr[i] > arr[maxIdx]) {
          maxIdx = i;
        }
      }
      return maxIdx;
    };
  
    for (let size = arr.length; size > 1; size--) {
      const maxIdx = findMax(size);
      if (maxIdx !== size - 1) {
        if (maxIdx !== 0) {
          // Flip the maximum element to the front
          flip(maxIdx);
          steps.push({
            array: [...arr],
            swapped: [maxIdx, 0],
          });
        }
  
        // Flip the maximum element to its correct position
        flip(size - 1);
        steps.push({
          array: [...arr],
          swapped: [size - 1, 0],
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
  