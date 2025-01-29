interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  function getMax(arr: number[]): number {
    return Math.max(...arr);
  }
  
  function countingSort(arr: number[], exp: number, steps: SortStep[]): void {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
  
    // Store count of occurrences
    for (let i = 0; i < n; i++) {
      const index = Math.floor(arr[i] / exp) % 10;
      count[index]++;
    }
  
    // Change count[i] so that count[i] contains the actual position of this digit in output[]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
  
    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
      const index = Math.floor(arr[i] / exp) % 10;
      output[count[index] - 1] = arr[i];
      count[index]--;
    }
  
    // Copy the output array to arr[], so that arr[] contains sorted numbers according to the current digit
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
    }
  
    steps.push({
      array: [...arr],
    });
  }
  
  export function radixSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    // Get the maximum number to know the number of digits
    const max = getMax(arr);
  
    // Do counting sort for every digit
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      countingSort(arr, exp, steps);
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  