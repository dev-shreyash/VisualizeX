interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  function insertionSort(arr: number[], steps: SortStep[]): void {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
  
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
  
      steps.push({
        array: [...arr],
      });
    }
  }
  
  export function bucketSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    // Find the maximum value in the array to determine the number of buckets
    const max = Math.max(...arr);
    const min = Math.min(...arr);
  
    // Number of buckets
    const bucketCount = Math.floor(Math.sqrt(arr.length));
    const bucketRange = (max - min) / bucketCount;
  
    // Create empty buckets
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
  
    // Distribute elements into buckets
    for (const num of arr) {
      // Ensure index is within bounds
      const index = Math.min(
        Math.floor((num - min) / bucketRange),
        bucketCount - 1 // Ensure index doesn't exceed the number of buckets
      );
      buckets[index].push(num);
    }
  
    // Sort each bucket using insertion sort
    for (const bucket of buckets) {
      insertionSort(bucket, steps);
    }
  
    // Concatenate the buckets back into the array
    let index = 0;
    for (const bucket of buckets) {
      for (const num of bucket) {
        arr[index++] = num;
      }
    }
  
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }
  