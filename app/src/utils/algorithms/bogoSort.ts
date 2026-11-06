export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function bogoSort(array: number[], maxIterations: number = 1000): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  const isSorted = (): boolean => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] > arr[i]) return false;
    }
    return true;
  };

  const shuffle = (): void => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  let iterations = 0;
  while (!isSorted() && iterations < maxIterations) {
    shuffle();
    steps.push({
      array: [...arr],
      swapped: [0, arr.length - 1],
    });
    iterations++;
  }

  steps.push({
    array: [...arr],
    sorted: isSorted(),
  });

  return steps;
}
