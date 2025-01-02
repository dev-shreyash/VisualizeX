import { useEffect, useState, useRef } from "react";

interface VisualizerProps {
  steps: { array: number[]; highlightedIndices: number[] }[]; // Highlighted indices for the current step
  isSorting: boolean;
  isPaused: boolean;
  speed: number;
  userData: number[];
  algorithm: {
    key: string;
    name: string;
    description: string;
    image: string;
    route: string;
  };
  onSortingComplete: (time: number) => void; // Callback function to pass data to parent
}

export default function Visualizer({
  steps,
  isSorting,
  isPaused,
  speed,
  userData,
  algorithm,
  onSortingComplete,
}: VisualizerProps) {
  const [sortingComplete, setSortingComplete] = useState(false);
  const [sortingTime, setSortingTime] = useState<number | null>(null); // State to store sorting time
  const [currentSteps, setCurrentSteps] = useState<
    {
      array: number[];
      highlightedIndices: number[];
    }[]
  >([]);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setSortingComplete(false);
  }, [userData]);

  useEffect(() => {
    setSortingTime(null);
  }, [userData]);

//   useEffect(() => {
//     if (sortingTime !== null) {
//       onSortingComplete(sortingTime);
//     }
//   }, [sortingTime]);

  // Algorithm handler
  const algorithmMap: Record<string, Function> = {
    bubbleSort: async (data: number[]) =>
      (await import("@/utils/algorithms/bubbleSort")).bubbleSort(data),
    mergeSortTopDown: async (data: number[]) =>
      (await import("@/utils/algorithms/mergeSortTopDown")).mergeSortTopDown(
        data
      ),
    quickSort: async (data: number[]) =>
      (await import("@/utils/algorithms/quickSort")).quickSort(data),
    mergeSortBottomUp: async (data: number[]) =>
      (await import("@/utils/algorithms/mergeSortBottomUp")).mergeSortBottomUp(
        data
      ),
  };

  useEffect(() => {
    const executeAlgorithm = async () => {
      if (!algorithmMap[algorithm.key]) {
        console.error(`Algorithm "${algorithm.key}" not found.`);
        return;
      }
      const algoFunction = algorithmMap[algorithm.key];
      const generatedSteps = await algoFunction(userData);
      setCurrentSteps(generatedSteps);
      startTimeRef.current = Date.now(); // Capture start time
    };

    if (isSorting) {
      executeAlgorithm();
    }
  }, [isSorting, algorithm.key]);

  const renderStep = (step: any) => {
    if (!step) return null; // Check if step is defined

    return step.array.map((num: number, index: number) => {
        // Check if the current index matches either left or right indices
        const isHighlighted =
          index === step.currentLeftIndex || index === step.currentRightIndex;
      
        return (
            
          <div
            key={index}
            className={`w-5 h-5 flex items-center justify-center text-sm p-0 rounded-md border ${
              isHighlighted ? "bg-yellow-500" : "bg-gray-300"
            }`}
          >
            {num}
          </div>
        );
      });
      
  };

  useEffect(() => {
    let stepIndex = 0;

    const renderAlgorithmSteps = () => {
      if (isPaused || !isSorting || currentSteps.length === 0) return; // Added check for empty steps

      const currentStep = currentSteps[stepIndex];
      if (!currentStep) return; // Added check for undefined currentStep

      setCurrentSteps([currentStep]);

      stepIndex++;

      if (stepIndex < currentSteps.length && !isPaused) {
        const stepDuration =
          speed === 1 ? 20 : speed === 0.75 ? 50 : speed === 0.5 ? 100 : 300;

        setTimeout(renderAlgorithmSteps, stepDuration);
      } else {
        setSortingComplete(true);
        const endTime = Date.now();
        const elapsedTime = (endTime - (startTimeRef.current ?? endTime)) / 1000;
        setSortingTime(elapsedTime);
      }
    };

    if (isSorting) {
      renderAlgorithmSteps();
    }
  }, [currentSteps, isPaused, isSorting, speed]);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <div className="flex space-x-1">
        {currentSteps.length > 0 && renderStep(currentSteps[0])}
      </div>

      <div className="flex w-full justify-around mt-4">
        {userData.map((num, index) => (
          <div
            key={index}
            className="w-10 h-10 flex items-center justify-center text-sm p-0 border rounded-md bg-gray-200"
          >
            {num}
          </div>
        ))}
      </div>

    
    </div>
  );
}
