interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  function insertionSort(arr: number[], left: number, right: number, steps: SortStep[]) {
    for (let i = left + 1; i <= right; i++) {
      const key = arr[i];
      let j = i - 1;
      while (j >= left && arr[j] > key) {
        arr[j + 1] = arr[j];
        steps.push({
          array: [...arr],
          currentLeftIndex: j,
          currentRightIndex: j + 1,
          swapped: [j, j + 1],
        });
        j--;
      }
      arr[j + 1] = key;
      steps.push({
        array: [...arr],
        currentLeftIndex: j + 1,
        currentRightIndex: i,
        swapped: [j + 1, i],
      });
    }
  }
  
  function merge(arr: number[], left: number, mid: number, right: number, steps: SortStep[]) {
    const len1 = mid - left + 1;
    const len2 = right - mid;
  
    const leftArr = new Array(len1);
    const rightArr = new Array(len2);
  
    for (let i = 0; i < len1; i++) {
      leftArr[i] = arr[left + i];
    }
    for (let i = 0; i < len2; i++) {
      rightArr[i] = arr[mid + 1 + i];
    }
  
    let i = 0;
    let j = 0;
    let k = left;
  
    while (i < len1 && j < len2) {
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      steps.push({
        array: [...arr],
        currentLeftIndex: i + left,
        currentRightIndex: j + mid + 1,
        comparison: [i + left, j + mid + 1],
      });
      k++;
    }
  
    while (i < len1) {
      arr[k] = leftArr[i];
      steps.push({
        array: [...arr],
        currentLeftIndex: i + left,
        swapped: [i + left, k],
      });
      i++;
      k++;
    }
  
    while (j < len2) {
      arr[k] = rightArr[j];
      steps.push({
        array: [...arr],
        currentRightIndex: j + mid + 1,
        swapped: [j + mid + 1, k],
      });
      j++;
      k++;
    }
  }
  
  export function timSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const n = array.length;
    const RUN = 32;
  
    // Apply insertion sort to small sections
    for (let i = 0; i < n; i += RUN) {
      insertionSort(array, i, Math.min(i + RUN - 1, n - 1), steps);
    }
  
    // Merge the sections
    for (let size = RUN; size < n; size = 2 * size) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = Math.min(n - 1, left + size - 1);
        const right = Math.min((left + 2 * size - 1), n - 1);
  
        if (mid < right) {
          merge(array, left, mid, right, steps);
        }
      }
    }
  
    // Final sorted state
    steps.push({
      array: [...array],
      sorted: true,
    });
  
    return steps;
  }
  