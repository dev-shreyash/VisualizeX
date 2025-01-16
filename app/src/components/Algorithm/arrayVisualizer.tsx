import { useEffect, useState, useRef } from "react";

interface VisualizerProps {
  // steps: {
  //   array: number[];
  //   highlightedIndices: number[];
  //   currentLeftIndex?: number;
  //   currentRightIndex?: number;
  //   pivot?: number;
  //   comparison?: [number, number];
  //   swapped?: [number, number];
  //   merged?: [number, number];
  //   sorted?: boolean;
  // }[];
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
  
  onSortingComplete: (time: number) => void;
}

export default function Visualizer({
  //steps,
  isSorting,
  isPaused,
  speed,
  userData,
  algorithm,
  onSortingComplete,
}: VisualizerProps) {
  const [sortingComplete, setSortingComplete] = useState(false);
  const [sortingTime, setSortingTime] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<
  | null
  | {
      array: number[];
      highlightedIndices: number[];
      currentLeftIndex?: number;
      currentRightIndex?: number;
      pivot?: number;
      comparison?: [number, number];
      swapped?: [number, number];
      merged?: [number, number];
      sorted?: boolean;
    }
>(null);
  const startTimeRef = useRef<number | null>(null);

  // Algorithm map
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
    selectionSort: async (data: number[]) =>
      (await import("@/utils/algorithms/selectionSort")).selectionSort(data),
    insertionSort: async (data: number[]) =>
      (await import("@/utils/algorithms/insertionSort")).insertionSort(data),
  };

  // Reset states when user data changes
  useEffect(() => {
    setSortingComplete(false);
    setSortingTime(null);
    setCurrentStep(null);
  }, [userData]);

  // Run the selected algorithm when sorting starts
  useEffect(() => {
    const executeAlgorithm = async () => {
      if (!algorithmMap[algorithm.key]) {
        console.error(`Algorithm "${algorithm.key}" not found.`);
        return;
      }
      const algoFunction = algorithmMap[algorithm.key];
      const generatedSteps = await algoFunction(userData);
      startTimeRef.current = Date.now(); // Record the start time
      processSteps(generatedSteps); // Process algorithm steps
    };

    if (isSorting) {
      executeAlgorithm();
    }
  }, [isSorting, algorithm.key]);

  // Process and render steps
  const processSteps = (steps: any) => {
    let stepIndex = 0;

    const renderNextStep = () => {
      if (isPaused || !isSorting || stepIndex >= steps.length) {
        if (stepIndex >= steps.length) {
          setSortingComplete(true);
          const endTime = Date.now();
          const elapsedTime =
            (endTime - (startTimeRef.current ?? endTime)) / 1000;
          setSortingTime(elapsedTime);
          //onSortingComplete(elapsedTime); // Notify parent
        }
        return;
      }

      setCurrentStep(steps[stepIndex]);
      stepIndex++;

      const stepDuration =
      speed === 1 ? 0 : speed === 0.75 ? 150 : speed === 0.5 ? 300 : speed === 0.25 ? 600 : 3600;

      setTimeout(renderNextStep, stepDuration);
    };

    renderNextStep();
  };

  const stepDuration = 
  speed === 1 ? 0 : speed === 0.75 ? 150 : speed === 0.5 ? 300 : speed === 0.25 ? 600 : 3600;


  if (userData.length > 20) {
    return <div>Array too large to visualize`(max:20)`</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {/* Conditionally render based on isSorting */}
      {isSorting || sortingComplete ? (
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Render current step array */}
          <div className="flex w-full justify-around border-2">
            {currentStep?.array.map((num, index) => {
              // Determine the background color
              const getBackgroundColor = (i: number): string => {
                if (currentStep?.sorted) return "green";
                if (i === currentStep?.pivot) return "#ffcc00";
                if (i === currentStep?.currentLeftIndex) return "#ff5733";
                if (i === currentStep?.currentRightIndex) return "skyblue";
                if (currentStep?.comparison?.includes(i)) return "#1d4ed8";
                if (currentStep?.swapped?.includes(i)) return "black";
                return "#e5e7eb";
              };

              const getTextColor = (i: number): string => {
                if (currentStep?.sorted) return "#fff";
                if (i === currentStep?.pivot) return "#000";
                if (currentStep?.comparison?.includes(i)) return "#fff";
                if (currentStep?.swapped?.includes(i)) return "#fff";
                if (i === currentStep?.currentLeftIndex) return "#000";
                if (i === currentStep?.currentRightIndex) return "#000";
                return "#000";
              };

              return (
                <div
                  key={index}
                  className="w-full h-full flex items-center justify-center text-sm p-2 border-l-2 border-solid border-gray-300"
                  style={{
                    backgroundColor: getBackgroundColor(index),
                    color: getTextColor(index),
                    transition: `all ${stepDuration}ms ease-in-out`,
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-around border-2">
          {userData.map((num, index) => (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center text-sm p-2 border-l-2 border-solid border-gray-300 bg-[#e5e7eb]"
            >
              {num}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
