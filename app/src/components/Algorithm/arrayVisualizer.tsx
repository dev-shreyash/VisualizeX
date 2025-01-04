import { useEffect, useState, useRef } from "react";

interface VisualizerProps {
  steps: {
    array: number[];
    highlightedIndices: number[];
    currentLeftIndex?: number;
    currentRightIndex?: number;
    pivot?: number;
    comparison?: [number, number];
    swapped?: [number, number];
    merged?: [number, number];
    sorted?: boolean;
  }[]; // Highlighted indices for the current step
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
    setSortingTime(null);
  }, [userData]);

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

  useEffect(() => {
    let stepIndex = 0;

    const renderAlgorithmSteps = () => {
      if (userData.length ===0) return ;
      if (userData.length > 20) return;
      if (isPaused || !isSorting || currentSteps.length === 0) return;

      const currentStep = currentSteps[stepIndex];
      if (!currentStep) return;

      setCurrentSteps([currentStep]);

      stepIndex++;

      if (stepIndex < currentSteps.length && !isPaused) {
        const stepDuration =
          speed === 1 ? 20 : speed === 0.75 ? 50 : speed === 0.5 ? 100 : 300;

        setTimeout(renderAlgorithmSteps, stepDuration);
      } else {
        setSortingComplete(true);
        const endTime = Date.now();
        const elapsedTime =
          (endTime - (startTimeRef.current ?? endTime)) / 1000;
        setSortingTime(elapsedTime);
      }
    };

    if (isSorting) {
      renderAlgorithmSteps();
    }
  }, [currentSteps, isPaused, isSorting, speed]);
 

  if (userData.length > 20) {
    return <div>Array too large to visualize</div>;
  }
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {/* Conditionally render based on isSorting */}
      {isSorting || sortingComplete ? (
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Render current step array */}
          <div className="flex  w-full justify-around border-2 ">
          {currentSteps.length > 0 &&
              currentSteps[0].array.map((num, index) => {
                // Determine the background color based on conditions
                const getBackgroundColor = (i: number): string => {
                  if (currentSteps[0]?.sorted) return "green"; // Highlight sorted indices in green
                  if (i === currentSteps[0]?.pivot) return "#ffcc00"; // Highlight pivot index in yellow
                  if (i === currentSteps[0]?.currentLeftIndex) return "#ff5733"; // Highlight left index in blue
                  if (i === currentSteps[0]?.currentRightIndex) return "skyblue"; // Highlight right index in light blue
                 // if (currentSteps[0]?.merged?.includes(i)) return "blue"; // Highlight merged indices in blue
                  if (currentSteps[0]?.comparison?.includes(i)) return "black"; // Highlight comparison indices in pink
                  if (currentSteps[0]?.swapped?.includes(i)) return "#ff5733"; // Highlight swapped indices in red
                 return "#e5e7eb"; // Default color
                };
                const getTextColor = (i: number): string => {
                  if (currentSteps[0]?.sorted)
                    { 
                      return "#fff";
                    }
                  if (i === currentSteps[0]?.pivot)
                    { 
                      return "#000";
                    }
                  if (currentSteps[0]?.comparison?.includes(i))
                    { 
                      return "#fff";
                    }
                  if (currentSteps[0]?.swapped?.includes(i))
                    { 
                      return "#000";
                    }
                  if (i === currentSteps[0]?.currentLeftIndex)
                    { 
                      return "#000";
                    }
                  if (i === currentSteps[0]?.currentRightIndex)
                    { 
                      return "#000";
                    }
                  else {return "#000"; }
                  // Highlight sorted indices in green
                  // if (i === currentSteps[0]?.pivotIndex) return "#ffcc00"; // Highlight pivot index in yellow
                  // if (currentSteps[0]?.comparison?.includes(i)) return "pink"; // Highlight comparison indices in pink
                  // if (currentSteps[0]?.swapped?.includes(i)) return "#ff5733"; // Highlight swapped indices in red
                  // if (i === currentSteps[0]?.currentLeftIndex) return "#1e90ff"; // Highlight left index in blue
                  // if (i === currentSteps[0]?.currentRightIndex) return "skyblue"; // Highlight right index in light blue
                  
                };
                

                return (
                  <div
                    key={index}
                    className="w-full h-full flex items-center justify-center text-sm p-2 border-l-2 border-solid border-gray-300 "
                    style={{ backgroundColor: getBackgroundColor(index), color: getTextColor(index) }}
                  >
                    {num}
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="flex  w-full justify-around border-2 ">
          {userData.map((num, index) => (
            <div
              key={index}
              className="w-full h-full flex items-center justify-center text-sm p-2 border-l-2 border-solid border-gray-300 bg-[#e5e7eb] "
              >
              {num}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
