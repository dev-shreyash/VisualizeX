import { describe, it, expect } from "@jest/globals";
import { bogoSort } from "@/utils/algorithms/bogoSort";
import { bubbleSort } from "@/utils/algorithms/bubbleSort";
import { bucketSort } from "@/utils/algorithms/bucketSort";
import { combSort } from "@/utils/algorithms/combSort";
import { cycleSort } from "@/utils/algorithms/cycleSort";
import { gnomeSort } from "@/utils/algorithms/gnomeSort";
import { heapSort } from "@/utils/algorithms/heapSort";
import { insertionSort } from "@/utils/algorithms/insertionSort";
import { introspectiveSort } from "@/utils/algorithms/introspectiveSort";
import { mergeSortBottomUp } from "@/utils/algorithms/mergeSortBottomUp";
import { mergeSortTopDown } from "@/utils/algorithms/mergeSortTopDown";
import { oddEvenSort } from "@/utils/algorithms/oddEvenSort";
import { pancakeSort } from "@/utils/algorithms/pancakeSort";
import { quickSort } from "@/utils/algorithms/quickSort";
import { radixSort } from "@/utils/algorithms/radixSort";
import { selectionSort } from "@/utils/algorithms/selectionSort";
import { shellSort } from "@/utils/algorithms/shellSort";
import { timSort } from "@/utils/algorithms/timSort";

const DETERMINISTIC_ALGORITHMS: Record<string, (arr: number[]) => { array: number[]; sorted?: boolean }[]> = {
  bubbleSort,
  bucketSort,
  combSort,
  cycleSort,
  gnomeSort,
  heapSort,
  insertionSort,
  introspectiveSort,
  mergeSortBottomUp,
  mergeSortTopDown,
  oddEvenSort,
  pancakeSort,
  quickSort,
  radixSort,
  selectionSort,
  shellSort,
  timSort,
};

describe("Sorting Algorithms Test Suite", () => {
  const testCases = [
    { name: "empty array", input: [] },
    { name: "single-element array", input: [42] },
    { name: "already sorted array", input: [1, 2, 3, 4, 5, 6] },
    { name: "reverse sorted array", input: [6, 5, 4, 3, 2, 1] },
    { name: "array with duplicates", input: [5, 2, 8, 2, 5, 1, 8] },
    { name: "all equal elements", input: [7, 7, 7, 7, 7] },
    { name: "negative numbers", input: [-10, 4, -2, 0, 15, -3] },
    { name: "mixed large and small numbers", input: [1000, -500, 23, 0, 9999, -1] },
  ];

  for (const [algoName, algoFn] of Object.entries(DETERMINISTIC_ALGORITHMS)) {
    describe(`${algoName}`, () => {
      for (const tc of testCases) {
        it(`correctly sorts ${tc.name}`, () => {
          const original = [...tc.input];
          const expected = [...tc.input].sort((a, b) => a - b);

          const steps = algoFn(tc.input);

          // Ensure original array was not mutated
          expect(tc.input).toEqual(original);

          // Ensure at least one step was returned
          expect(steps.length).toBeGreaterThan(0);

          // Ensure final step is sorted and matches expected
          const finalStep = steps[steps.length - 1];
          expect(finalStep.array).toEqual(expected);
          expect(finalStep.sorted).toBe(true);
        });
      }
    });
  }

  describe("bogoSort (probabilistic with iteration cap)", () => {
    it("handles empty and single-element arrays deterministically", () => {
      const emptySteps = bogoSort([]);
      expect(emptySteps[emptySteps.length - 1].array).toEqual([]);

      const singleSteps = bogoSort([99]);
      expect(singleSteps[singleSteps.length - 1].array).toEqual([99]);
      expect(singleSteps[singleSteps.length - 1].sorted).toBe(true);
    });

    it("respects maxIterations limit on unsorted input", () => {
      const steps = bogoSort([5, 4, 3, 2, 1, 0, 9, 8], 20);
      expect(steps.length).toBeLessThanOrEqual(25);
    });
  });
});

