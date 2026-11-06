export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  pivot?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function quickSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];

  if (arr.length <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        pivot: high,
        currentLeftIndex: i + 1,
        currentRightIndex: j,
        comparison: [i + 1, j],
      });

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array: [...arr],
          currentLeftIndex: i,
          currentRightIndex: j,
          swapped: [i, j],
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: [...arr],
      currentLeftIndex: i + 1,
      currentRightIndex: high,
      swapped: [i + 1, high],
    });

    return i + 1;
  }

  function sort(low: number, high: number): void {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
