interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  const INSERTION_SORT_THRESHOLD = 16;
  
  function insertionSort(arr: number[], left: number, right: number, steps: SortStep[]): void {
    for (let i = left + 1; i <= right; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= left && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
      steps.push({ array: [...arr] });
    }
  }
  
  function heapify(arr: number[], n: number, i: number, steps: SortStep[]): void {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
  
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
  
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }
  
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({ array: [...arr], swapped: [i, largest] });
      heapify(arr, n, largest, steps);
    }
  }
  
  function heapSort(arr: number[], steps: SortStep[]): void {
    let n = arr.length;
  
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i, steps);
    }
  
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      steps.push({ array: [...arr], swapped: [0, i] });
      heapify(arr, i, 0, steps);
    }
  }
  
  function partition(arr: number[], low: number, high: number, steps: SortStep[]): number {
    let pivot = arr[high];
    let i = low - 1;
  
    for (let j = low; j < high; j++) {
      steps.push({ array: [...arr], comparison: [j, high] });
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({ array: [...arr], swapped: [i, j] });
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({ array: [...arr], swapped: [i + 1, high] });
    return i + 1;
  }
  
  function introsortUtil(arr: number[], low: number, high: number, depthLimit: number, steps: SortStep[]): void {
    let size = high - low + 1;
  
    if (size < INSERTION_SORT_THRESHOLD) {
      insertionSort(arr, low, high, steps);
      return;
    }
  
    if (depthLimit === 0) {
      heapSort(arr, steps);
      return;
    }
  
    let pivot = partition(arr, low, high, steps);
    introsortUtil(arr, low, pivot - 1, depthLimit - 1, steps);
    introsortUtil(arr, pivot + 1, high, depthLimit - 1, steps);
  }
  
  export function introspectiveSort(array: number[]): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array];
  
    let depthLimit = 2 * Math.floor(Math.log2(arr.length));
  
    introsortUtil(arr, 0, arr.length - 1, depthLimit, steps);
  
    steps.push({ array: [...arr], sorted: true });
  
    return steps;
  }
  