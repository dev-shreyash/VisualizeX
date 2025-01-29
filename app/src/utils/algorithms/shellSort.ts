interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  export function shellSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array];
    let n = arr.length;
    let gap = Math.floor(n / 2);
  
    // Loop through the array for sorting with the gap reduction
    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j = i;
  
        // Record the comparison steps
        steps.push({
          array: [...arr],
          currentLeftIndex: j,
          currentRightIndex: j - gap,
          comparison: [j, j - gap],
        });
  
        // Move elements that are greater than the current element
        while (j >= gap && arr[j - gap] > temp) {
          arr[j] = arr[j - gap];
          j -= gap;
  
          // Record the swap
          steps.push({
            array: [...arr],
            swapped: [j, j - gap],
          });
        }
        
        arr[j] = temp;
        
        // Record the insertion step
        steps.push({
          array: [...arr],
          currentLeftIndex: j,
          currentRightIndex: i,
          swapped: [j, i],
        });
      }
  
      // Reduce the gap
      gap = Math.floor(gap / 2);
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  