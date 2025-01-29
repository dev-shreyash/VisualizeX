interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  function heapify(arr: number[], n: number, i: number, steps: SortStep[]) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
  
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
  
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
  
    if (largest !== i) {
      // Swap the elements
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      
      steps.push({
        array: [...arr],
        currentLeftIndex: i,
        currentRightIndex: largest,
        swapped: [i, largest],
      });
  
      heapify(arr, n, largest, steps);
    }
  }
  
  export function heapSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
    const n = arr.length;
  
    // Build the max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, steps);
    }
  
    // Extract elements from the heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move the current root to the end
      [arr[0], arr[i]] = [arr[i], arr[0]];
      
      steps.push({
        array: [...arr],
        currentLeftIndex: 0,
        currentRightIndex: i,
        swapped: [0, i],
      });
  
      // Call heapify on the reduced heap
      heapify(arr, i, 0, steps);
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  