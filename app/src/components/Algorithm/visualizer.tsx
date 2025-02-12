import { mergeSortBottomUp } from "@/utils/algorithms/mergeSortBottomUp";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface VisualizerProps {
 // steps: { array: number[]; highlightedIndices: number[] }[]; // Highlighted indices for the current step
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
  currentSteps: (array: number[]) => void; // send steps back
}

export default function Visualizer({
 // steps,
  isSorting,
  isPaused,
  speed,
  userData,
  algorithm,
  onSortingComplete,
}: VisualizerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [sortingComplete, setSortingComplete] = useState(false);
  const [sortingTime, setSortingTime] = useState<number | null>(null); // State to store sorting time
  const [isPausedState, setIsPausedState] = useState(isPaused); // State to store isPaused state
  useEffect(() => {
    setSortingComplete(false);
  }, [userData]);

  useEffect(() => {
    setSortingTime(null);
  }, [userData]);

  useEffect(() => {
    if (sortingTime !== null) {
      onSortingComplete(sortingTime);
    }
  }, [sortingTime]);

  useEffect(() => {
    setIsPausedState(isPaused);
    console.log("is paused:",isPaused)
  }, [isPaused]);

  // Initial rendering of array
  useEffect(() => {
    const svgContainer = svgRef.current?.parentElement;
    const width = svgContainer?.clientWidth ?? 0;
    const height = svgContainer?.clientHeight ?? 0;
    const maxBarHeight = height;

    const svg = d3.select(svgRef.current);

    // Set responsive SVG attributes
    svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", "#f3f4f6");

    // Create a tooltip element
    if (!svgContainer) return;
    const tooltip = d3
      .select(svgContainer)
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    const renderArray = (data: number[]) => {
      const maxVal = Math.max(...data);
      const barWidth = width / data.length;

      const bars = svg.selectAll("rect").data(data);

      // Enter new bars
      bars
        .enter()
        .append("rect")
       // .merge(bars)
        .attr("x", (_, i) => i * barWidth)
        .attr("y", (d) => maxBarHeight - (d / maxVal) * maxBarHeight)
        .attr("width", barWidth - 2)
        .attr("height", (d) => (d / maxVal) * maxBarHeight)
        .attr("fill", "steelblue")
        .on("mouseover", function (event, d) {
          // Show tooltip on hover
          tooltip
            .style("opacity", 1)
            .text(d)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
          d3.select(this).attr("fill", "#4ade80"); // Highlight bar on hover
        })
        .on("mousemove", (event) => {
          // Update tooltip position
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", function () {
          // Hide tooltip and reset bar color
          tooltip.style("opacity", 0);
          d3.select(this).attr("fill", "steelblue");
        });

         // Merge the new bars with the existing bars
        svg.selectAll("rect")
          .data(data)
          .merge(bars)
          .attr("x", (_, i) => i * barWidth)
          .attr("y", (d) => maxBarHeight - (d / maxVal) * maxBarHeight)
          .attr("width", barWidth - 2)
          .attr("height", (d) => (d / maxVal) * maxBarHeight)
          .attr("fill", "steelblue");

     

      // Remove extra bars
      bars.exit().remove();
    };

    // Initial render with userData
    renderArray(userData);
  }, [userData]);

  const [currentSteps, setCurrentSteps] = useState<
    {
      array: number[];
      highlightedIndices: number[];
      currentLeftIndex: number | null;
      currentRightIndex: number | null;
      comparison: [number, number] | null;
      swapped: [number, number] | null;
      merged: [number, number] | null;
      sorted: boolean | null;
      pivot: number | null;

      pivotIndex: number | null;
    }[]
  >([]);
  const [sorting, setSorting] = useState(false);

  // const [algorithmData, setAlgorithmData] = useState<Algorithm | null>(null);

  // useEffect(() => {
  //     const AlgorithmData = async () => {
  //       const response = await fetch("/data/algorithms.json");
  //       const data = await response.json();
  //       // Find the selected algorithm by key
  //       const selectedAlgorithm = data.find(
  //         (item: { key: string }) => item.key === algorithm.key
  //       );
  //       setAlgorithmData(selectedAlgorithm || null);
  //     };

  //      AlgorithmData();
  //   }, [algorithm]);

  // console.log(algorithmData?.key)

  // const algorithmName=algorithmData?.key;

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
      gnomeSort: async (data: number[]) =>
        (await import("@/utils/algorithms/gnomeSort")).gnomeSort(data),
      combSort: async (data: number[]) =>
        (await import("@/utils/algorithms/combSort")).combSort(data),
      shellSort: async (data: number[]) =>
        (await import("@/utils/algorithms/shellSort")).shellSort(data),
      oddEvenSort: async (data: number[]) =>
        (await import("@/utils/algorithms/oddEvenSort")).oddEvenSort(data),
      pancakeSort: async (data: number[]) =>
        (await import("@/utils/algorithms/pancakeSort")).pancakeSort(data),
      
      bogoSort: async (data: number[]) =>
        (await import("@/utils/algorithms/bogoSort")).bogoSort(data),
      
      cycleSort: async (data: number[]) =>
        (await import("@/utils/algorithms/cycleSort")).cycleSort(data),
      
      timSort: async (data: number[]) =>
        (await import("@/utils/algorithms/timSort")).timSort(data),
      
      heapSort: async (data: number[]) =>
        (await import("@/utils/algorithms/heapSort")).heapSort(data),
      
      radixSort: async (data: number[]) =>
        (await import("@/utils/algorithms/radixSort")).radixSort(data),
      
      bucketSort: async (data: number[]) =>
        (await import("@/utils/algorithms/bucketSort")).bucketSort(data),

      introspectiveSort: async (data: number[]) =>
        (await import("@/utils/algorithms/introspectiveSort")).introspectiveSort(data),
      
  };

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const executeAlgorithm = async () => {
      if (isPausedState) return;
      if (!algorithmMap[algorithm.key]) {
        console.error(`Algorithm "${algorithm.key}" not found.`);
        return;
      }
      const algoFunction = algorithmMap[algorithm.key];
      const generatedSteps = await algoFunction(userData);
      setCurrentSteps(generatedSteps);
      setSorting(true);
      startTimeRef.current = Date.now(); // Capture start time
    };

    if (isSorting) {
      executeAlgorithm();
    }
  }, [isSorting, algorithm.key, isPausedState,speed]);

  useEffect(() => {
    const svgContainer = svgRef.current?.parentElement;
    const width = svgContainer?.clientWidth ?? 0;
    const height = svgContainer?.clientHeight ?? 0;
    const maxBarHeight = height;

    const svg = d3.select(svgRef.current);

    svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", "#f3f4f6");

    const renderArrayWithValues = ({
      data,
      currentLeftIndex = null,
      currentRightIndex = null,
      sorted = false,
      pivotIndex = null,
      comparison = null,
      swapped = null,
      merged = null,
    }: {
      data: number[];
      currentLeftIndex?: number | null;
      currentRightIndex?: number | null;
      sorted?: boolean;
      pivotIndex?: number | null;
      comparison?: [number, number] | null;
      swapped?: [number, number] | null;
      merged?: [number, number] | null;
    }) => {
      // console.log(swapped);
      const maxVal = Math.max(...data);
      const barWidth = width / data.length;

      // Bind the data to the bars
      const bars = svg.selectAll("rect").data(data);

      // Enter and update bars
      bars
        .enter()
        .append("rect")
        .merge(bars as any)
        .transition() // Apply transition
        .duration(() => {
          if (speed === 1) return 0;
          if (speed === 0.75) return 150;
          if (speed === 0.5) return 300;
          if (speed === 0.25) return 600;
          if (speed === 0.00) return 3600;

          return 0; // Default
        })
        .attr("x", (_, i) => i * barWidth)
        .attr("y", (d) => maxBarHeight - (d / maxVal) * maxBarHeight)
        .attr("width", barWidth - 2)
        .attr("height", (d) => (d / maxVal) * maxBarHeight)
        .attr("fill", (_, i) => {
          if (i === currentLeftIndex) return "#ff5733"; // Highlight left index in orange
          if (i === currentRightIndex) return "skyblue"; // Highlight right index in blue
          if (i === pivotIndex) return "#ffcc00"; // Highlight pivot index in yellow
          if (comparison && comparison.includes(i)) return "#1d4ed8 "; // Highlight comparison indices in pink
          if (swapped && swapped.includes(i)) return "black"; // Highlight swapped indices in green
          if (merged && merged.includes(i)) return "black"; // Highlight swapped indices in green
          if (sorted) return "green"; // Highlight sorted index in green
          return "steelblue"; // Default bar color
        });

        

      // Remove old bars
      bars
        .exit()
        .transition() // Smoothly transition out
        .duration(() => {
          if (speed === 1) return 0;
          if (speed === 0.75) return 150;
          if (speed === 0.5) return 300;
          if (speed === 0.25) return 600;
          if (speed === 0.00) return 3600;

          return 0; // Default
        })
        .attr("height", 0)
        .attr("y", maxBarHeight)
        .remove();

      // Remove old pivot lines
      svg.selectAll(".pivot").remove();
    };

    let stepIndex = 0;

   
    const renderStep = () => {
      if (isPausedState || !sorting) return;
      console.log(isPausedState)

      const step = currentSteps[stepIndex];
      renderArrayWithValues({
        data: step.array,
        currentLeftIndex: step.currentLeftIndex,
        currentRightIndex: step.currentRightIndex,
        pivotIndex: step.pivot,
        comparison: step.comparison,
        swapped: step.swapped,
        sorted: step.sorted ?? undefined,
      });

      stepIndex++;

      if (stepIndex < currentSteps.length && !isPausedState) {
        const stepDuration =
          speed === 1 ? 0 : speed === 0.75 ? 150 : speed === 0.5 ? 300 : speed === 0.25 ? 600 : 3600;

        setTimeout(renderStep, stepDuration);
      } else {
        setSorting(false);
        setSortingComplete(true);
        const endTime = Date.now();
        const elapsedTime =
          (endTime - (startTimeRef.current ?? endTime)) / 1000;
        setSortingTime(elapsedTime);
      }
    };

    if (sorting) {

      renderStep();
    }
  }, [currentSteps, isPausedState, sorting, speed]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Conditionally render SVG elements based on sorting state */}
      {isSorting || sortingComplete ? (
        <>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />

          <div className="flex w-full justify-around">
            {userData.map((num, index) => (
              <div
                key={index}
                className="w-5 h-5 flex items-center text-xs p-0 justify-center border rounded  text-black"
              >
                {num}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
          <div className="flex  justify-around w-full">
            {userData.map((num, index) => (
              <div
                key={index}
                className="w-5 h-5 flex items-center text-xs p-0 justify-center border rounded  text-black"
              >
                {num}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
