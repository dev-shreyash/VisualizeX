interface SortStep {
    array: number[];
    currentLeftIndex?: number; // Current index of the left array being processed
    currentRightIndex?: number; // Current index of the right array being processed
    comparison?: [number, number]; // Indices being compared
    swapped?: [number, number]; // Indices that were swapped
    merged?: [number, number]; // Range of indices being merged
    sorted?: boolean; // Indicates if the array is fully sorted
  }
  
  export function mergeSortBottomUp(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutation
    const n = arr.length;
  
    // Helper function to merge two sorted sub-arrays
    function merge(arr: number[], left: number, mid: number, right: number): void {
      const leftArray = arr.slice(left, mid + 1);
      const rightArray = arr.slice(mid + 1, right + 1);
  
      let i = 0,
        j = 0,
        k = left;
  
      while (i < leftArray.length && j < rightArray.length) {
        // Record comparison step with separate indices
        steps.push({
          array: [...arr],
          comparison: [left + i, mid + 1 + j], // Highlight the indices being compared
          currentLeftIndex: left + i, // Left index being processed
          currentRightIndex: mid + 1 + j, // Right index being processed
        });
  
        if (leftArray[i] <= rightArray[j]) {
          arr[k++] = leftArray[i++];
        } else {
          arr[k++] = rightArray[j++];
        }
      }
  
      // Add remaining elements from left array
      while (i < leftArray.length) {
        steps.push({
          array: [...arr],
          currentLeftIndex: left + i, // Highlight the current left index
        });
        arr[k++] = leftArray[i++];
      }
  
      // Add remaining elements from right array
      while (j < rightArray.length) {
        steps.push({
          array: [...arr],
          currentRightIndex: mid + 1 + j, // Highlight the current right index
        });
        arr[k++] = rightArray[j++];
      }
  
      // Record merged step with range
      steps.push({
        array: [...arr],
        merged: [left, right],
      });
    }
  
    // Bottom-up approach: Start with sub-arrays of size 1, and then merge progressively larger sub-arrays
    let size = 1;
    while (size < n) {
      for (let left = 0; left < n - size; left += 2 * size) {
        const mid = Math.min(left + size - 1, n - 1);
        const right = Math.min(left + 2 * size - 1, n - 1);
  
        // Merge the two sub-arrays
        merge(arr, left, mid, right);
      }
      size *= 2; // Double the size of the sub-arrays to merge in the next iteration
    }
  
    // Final sorted state
    steps.push({
      array: [...arr],
      sorted: true,
    });
  
    return steps;
  }

  