import { useEffect, useState, useRef, use } from "react";
import { set } from "zod";

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
      currentRightIndex?: number;
      currentLeftIndex?: number;
      pivot?: number;
      comparison?: [number, number];
      swapped?: [number, number];
      merged?: [number, number];
      sorted?: boolean;
    }[]
  >([]);

  const logContainerRef = useRef<HTMLDivElement | null>(null); // Ref to the log container to scroll

  // Speak function with dynamic speech rate
  let isFirstStart = true;

  const speak = (messageSpeech: string) => {
    if (speed !== 0.00) return;
  
    // Delay the first start by 3600ms
    if (isFirstStart) {
      isFirstStart = false;
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(messageSpeech);
  
        utterance.lang = 'en-US';
        utterance.rate = getSpeechRate(speed);
  
        speechSynthesis.speak(utterance);
      }, 2600); // Delay of 3600ms
    } else {
      // For subsequent speeches, no delay
      const utterance = new SpeechSynthesisUtterance(messageSpeech);
  
      utterance.lang = 'en-US';
      utterance.rate = getSpeechRate(speed);
  
      speechSynthesis.speak(utterance);
    }
  };
  



  // Helper function to map the speed to a speech rate
  const getSpeechRate = (speed: number): number => {
    switch (speed) {
      case 1:
        return 1.75; // Normal speed
      case 0.75:
        return 1.5; // Slower
      case 0.5:
        return 1.2; // Even slower
      case 0.25:
        return 1.0; // Very slow
      default:
        return 1.75; // Default rate if no match
    }
  };

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
    selectionSort: async (data: number[]) =>
      (await import("@/utils/algorithms/selectionSort")).selectionSort(data),
    insertionSort: async (data: number[]) =>
      (await import("@/utils/algorithms/insertionSort")).insertionSort(data),
  };

  useEffect(() => {
    // Reset logs and clear ongoing speech when speed changes
    const handleSpeedChange = () => {
      speechSynthesis.cancel(); // Stop ongoing speech synthesis
      setLogs([]); // Reset logs
      stepIndexRef.current = 0; // Reset step index
  
      
    };
  
    handleSpeedChange();
  }, [speed]);
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
  }, [isSorting, algorithm.key, userData,speed]);

  // Generate full log messages based on the current step
  const generateFullLogMessage = (): string => {
    const currentStep = currentSteps[stepIndexRef.current];
  
    if (!currentStep) return "No step found."; // Handle missing step more clearly
  
    // If the array is already sorted, display a simple message
    if (currentStep.sorted === true) {
      return `Step ${stepIndexRef.current}: The array is sorted!`;
    }
  
    const messages: string[] = [];
  
    // If a pivot is defined, explain what it is and its position
    if (currentStep.pivot !== undefined) {
      messages.push(
        `The pivot element is ${currentSteps?.[stepIndexRef.current]?.array[currentStep.pivot]}, located at index ${currentStep.pivot}.`
      );
    }
  
    // If the left pointer is defined, describe it
    if (currentStep.currentLeftIndex !== undefined) {
      messages.push(
        `The left pointer is pointing at element ${currentSteps?.[stepIndexRef.current]?.array[currentStep.currentLeftIndex]}, which is at index ${currentStep.currentLeftIndex}.`
      );
    }
  
    // If the right pointer is defined, describe it
    if (currentStep.currentRightIndex !== undefined) {
      messages.push(
        `The right pointer is pointing at element ${currentSteps?.[stepIndexRef.current]?.array[currentStep.currentRightIndex]}, which is at index ${currentStep.currentRightIndex}.`
      );
    }
  
    // If a comparison is being made, describe the comparison
    if (currentStep.comparison) {
      messages.push(
        `Comparing elements ${currentSteps?.[stepIndexRef.current]?.array[currentStep.comparison[0]]} (at index ${currentStep.comparison[0]}) and ${currentSteps?.[stepIndexRef.current]?.array[currentStep.comparison[1]]} (at index ${currentStep.comparison[1]}).`
      );
    }
  
    // If elements were swapped, describe the swap
    if (currentStep.swapped) {
      messages.push(
        `Swapped elements ${currentSteps?.[stepIndexRef.current]?.array[currentStep.swapped[0]]} (index ${currentStep.swapped[0]}) and ${currentSteps?.[stepIndexRef.current]?.array[currentStep.swapped[1]]} (index ${currentStep.swapped[1]}).`
      );
    }
  
    // If elements were merged, describe the merge
    if (currentStep.merged) {
      messages.push(
        `Merged elements ${currentSteps?.[stepIndexRef.current]?.array[currentStep.merged[0]]} (index ${currentStep.merged[0]}) and ${currentSteps?.[stepIndexRef.current]?.array[currentStep.merged[1]]} (index ${currentStep.merged[1]}) to form a sorted section.`
      );
    }
  
    return `Step ${stepIndexRef.current}: ${messages.join(" ")}`;
  };
  

  // Generate minimal log messages for speech synthesis
  const generateMinimalLogMessage = (): string => {
    const currentStep = currentSteps[stepIndexRef.current];

    if (!currentStep) return "No step found."; // If no step exists

    const messagesSpeech: string[] = [];

    // If the array is already sorted, display a simple message
    if (currentStep.sorted === true) {
      return `Array sorted!`;
    }

    // If a pivot is defined, mention it
    if (currentStep.pivot !== undefined) {
      messagesSpeech.push(`Pivot at index ${currentStep.pivot}`);
    }

    // If a comparison is being made, mention the comparison
    if (currentStep.comparison) {
      messagesSpeech.push(`Comparing elements at indices ${currentStep.comparison[0]} and ${currentStep.comparison[1]}`);
    }

    // If elements were swapped, mention the swap
    if (currentStep.swapped) {
      messagesSpeech.push(`Swapped elements at indices ${currentStep.swapped[0]} and ${currentStep.swapped[1]}`);
    }

    // If elements were merged, mention the merge
    if (currentStep.merged) {
      messagesSpeech.push(`Merged elements at indices ${currentStep.merged[0]} and ${currentStep.merged[1]}`);
    }

    return ` ${messagesSpeech.join(", ")}`;
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const processSteps = () => {
      // If sorting is paused or we've reached the end of the steps, stop processing
      if (isPaused || stepIndexRef.current >= currentSteps.length) return;

      const currentStep = currentSteps[stepIndexRef.current];
      if (!currentStep) return;

      // Full log message for display in the UI
      const fullLogMessage = generateFullLogMessage();
      // Minimal log message for speech synthesis
      const minimalLogMessage = generateMinimalLogMessage();
      
      // Add the full log message to the logs state for display
      setLogs((prevLogs) => [...prevLogs, fullLogMessage]);

      // Call the speak function to read out the minimal log message
      speak(minimalLogMessage); // Use the minimal message for speech

      stepIndexRef.current += 1;

      // Scroll to the bottom after the new log is added
      if (logContainerRef.current) {
        logContainerRef.current.scrollTop =
          logContainerRef.current.scrollHeight;
      }

      if (stepIndexRef.current < currentSteps.length && !isPaused) {
        const stepDuration =
          speed === 1 ? 0 : speed === 0.75 ? 150 : speed === 0.5 ? 300 : speed === 0.25 ? 600 : 3600;

        intervalId = setTimeout(processSteps, stepDuration);
      }
    };

    if (isSorting) {
      processSteps(); // Start processing steps
    }

    return () => clearTimeout(intervalId); // Clear timeout when component is unmounted or paused
  }, [currentSteps, isPaused, isSorting, speed]);


  return (
    <div className="flex flex-col items-center w-full h-[700px] p-4 bg-gray-800 overflow-hidden rounded-md">
      <div
        ref={logContainerRef}
        className="flex flex-col space-y-2 w-full overflow-auto max-h-full"
      >
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <div
              key={index}
              className="p-2 text-white rounded shadow-sm text-sm"
            >
              {log}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No logs yet...</div>
        )}
      </div>
    </div>
  );
}
