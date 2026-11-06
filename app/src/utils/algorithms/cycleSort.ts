export interface SortStep {
  array: number[];
  currentLeftIndex?: number;
  currentRightIndex?: number;
  comparison?: [number, number];
  swapped?: [number, number];
  sorted?: boolean;
}

export function cycleSort(array: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;

  if (n <= 1) {
    steps.push({ array: [...arr], sorted: true });
    return steps;
  }

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = arr[cycleStart];
    let pos = cycleStart;

    for (let i = cycleStart + 1; i < n; i++) {
      steps.push({
        array: [...arr],
        currentLeftIndex: cycleStart,
        currentRightIndex: i,
        comparison: [cycleStart, i],
      });
      if (arr[i] < item) {
        pos++;
      }
    }

    if (pos === cycleStart) continue;

    while (item === arr[pos]) {
      pos++;
    }

    if (pos !== cycleStart) {
      const temp = arr[pos];
      arr[pos] = item;
      item = temp;
      steps.push({
        array: [...arr],
        currentLeftIndex: cycleStart,
        currentRightIndex: pos,
        swapped: [cycleStart, pos],
      });
    }

    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (arr[i] < item) {
          pos++;
        }
      }

      while (item === arr[pos]) {
        pos++;
      }

      if (item !== arr[pos]) {
        const temp = arr[pos];
        arr[pos] = item;
        item = temp;
        steps.push({
          array: [...arr],
          currentLeftIndex: cycleStart,
          currentRightIndex: pos,
          swapped: [cycleStart, pos],
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    sorted: true,
  });

  return steps;
}
