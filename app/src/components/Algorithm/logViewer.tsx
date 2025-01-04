import { useEffect, useState, useRef } from "react";

interface LogViewerProps {
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
  }[];
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
}

export default function LogViewer({
  steps,
  isSorting,
  isPaused,
  speed,
  userData,
  algorithm,
}: LogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]); // Store logs persistently
  const stepIndexRef = useRef<number>(0);
  const [currentSteps, setCurrentSteps] = useState<
    {
      array: number[];
      highlightedIndices: number[];
    }[]
  >([]);
  
  const logContainerRef = useRef<HTMLDivElement | null>(null); // Ref to the log container to scroll

  // Update current steps whenever the steps prop changes
  useEffect(() => {
    setCurrentSteps(steps);
  }, [steps]);

  // Reset logs on new input (for the first time sorting starts)
  useEffect(() => {
    if (userData.length > 0) {
      setLogs([]);
      stepIndexRef.current = 0;
    }
  }, [userData]);

  // Algorithm map to dynamically import sorting algorithms
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

  // Execute the algorithm when sorting starts
  useEffect(() => {
    const executeAlgorithm = async () => {
      if (!algorithmMap[algorithm.key]) {
        console.error(`Algorithm "${algorithm.key}" not found.`);
        return;
      }
      const algoFunction = algorithmMap[algorithm.key];
      const generatedSteps = await algoFunction(userData);
      setCurrentSteps(generatedSteps); // Set the generated steps
    };

    if (isSorting) {
      executeAlgorithm();
    }
  }, [isSorting, algorithm.key, userData]);

  // Generate log messages based on the current step
  const generateLogMessage = (): string => {
    const currentStep = currentSteps[stepIndexRef.current];

    if (!currentStep) return ""; // Return an empty string if no step is found

    if (currentStep.sorted === true) {
      return `Step ${stepIndexRef.current}: Array is sorted!`;
    }

    const messages: string[] = [];
    if (currentStep.pivot !== undefined) {
      messages.push(`Pivot element is at index ${currentStep.pivot}.`);
    }
    if (currentStep.currentLeftIndex !== undefined) {
      messages.push(`Left pointer is at index ${currentStep.currentLeftIndex}.`);
    }
    if (currentStep.currentRightIndex !== undefined) {
      messages.push(`Right pointer is at index ${currentStep.currentRightIndex}.`);
    }
    if (currentStep.comparison) {
      messages.push(
        `Comparing elements at indices ${currentStep.comparison[0]} and ${currentStep.comparison[1]}.`
      );
    }
    if (currentStep.swapped) {
      messages.push(
        `Swapped elements at indices ${currentStep.swapped[0]} and ${currentStep.swapped[1]}.`
      );
    }
    if (currentStep.merged) {
      messages.push(
        `Merged elements from indices ${currentStep.merged[0]} to ${currentStep.merged[1]}.`
      );
    }
    return `Step ${stepIndexRef.current}: ${messages.join(" ")}`;
  };

  // Process steps at the given speed, depending on whether sorting is paused
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const processSteps = () => {
      if (isPaused || stepIndexRef.current >= currentSteps.length) return;

      const currentStep = currentSteps[stepIndexRef.current];
      if (!currentStep) return;

      const logMessage = generateLogMessage();
      setLogs((prevLogs) => [...prevLogs, logMessage]);

      stepIndexRef.current += 1;

      // Scroll to the bottom after the new log is added
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
      }

      if (stepIndexRef.current < currentSteps.length && !isPaused) {
        const stepDuration =
          speed === 1 ? 20 : speed === 0.75 ? 50 : speed === 0.5 ? 100 : 300;

        intervalId = setTimeout(processSteps, stepDuration);
      }
    };

    if (isSorting) {
      processSteps();
    }

    return () => clearTimeout(intervalId);
  }, [currentSteps, isPaused, isSorting, speed]);

  return (
    <div className="flex flex-col items-center w-full h-64 p-4 bg-gray-100 overflow-hidden border-2 border-gray-300 rounded-md">
      <div
        ref={logContainerRef}
        className="flex flex-col space-y-2 w-full overflow-auto max-h-full"
      >
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div
              key={index}
              className="p-2 bg-white border rounded shadow-sm text-sm"
            >
              {log}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No logs to display yet.</div>
        )}
      </div>
    </div>
  );
}
