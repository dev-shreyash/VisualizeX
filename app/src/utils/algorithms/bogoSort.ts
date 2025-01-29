interface SortStep {
    array: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    sorted?: boolean;
  }
  
  export function bogoSort(array: number[], maxIterations: number = 1000): SortStep[] {
    const steps: SortStep[] = [];
    const arr = [...array]; // Clone the array to avoid mutating the original
  
    // Check if the array is sorted
    const isSorted = (): boolean => {
      for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) return false;
      }
      return true;
    };
  
    // Randomly shuffle the array
    const shuffle = (): void => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
      }
    };
  
    let iterations = 0;
  
    // Perform BogoSort (shuffle until sorted or max iterations)
    while (!isSorted() && iterations < maxIterations) {
      shuffle();
      steps.push({
        array: [...arr],
        swapped: [0, 0], // Just to record the step (no specific swap)
      });
      iterations++;
    }
  
    // If sorted, mark it as sorted, else don't
    if (isSorted()) {
      steps.push({
        array: [...arr],
        sorted: true,
      });
    } else {
      steps.push({
        array: [...arr],
        sorted: false,
      });
    }
  
    return steps;
  }
  