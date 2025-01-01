import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface VisualizerProps {
  steps: { array: number[]; highlightedIndices: number[] }[]; // Highlighted indices for the current step
  isSorting: boolean;
  isPaused: boolean;
  speed: number;
  userData: number[];
  algorithm: { key: string; name: string; description: string; image: string; route: string };
  onSortingComplete: (time: number) => void;  // Callback function to pass data to parent
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
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [sortingComplete, setSortingComplete] = useState(false);
  const [sortingTime, setSortingTime] = useState<number | null>(null); // State to store sorting time

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

    const renderArray = (data: number[]) => {
      const maxVal = Math.max(...data);
      const barWidth = width / data.length;

      const bars = svg.selectAll("rect").data(data);

      // Enter new bars
      bars
        .enter()
        .append("rect")
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

  const [currentSteps, setCurrentSteps] = useState<{ array: number[]; highlightedIndices: number[]; pivotIndex: number | null }[]>([]);
  const [sorting, setSorting] = useState(false);

  const algorithmMap: Record<string, Function> = {
    bubbleSort: async (data: number[]) =>
      (await import("@/utils/algorithms/bubbleSort")).bubbleSort(data),
    mergeSort: async (data: number[]) =>
      (await import("@/utils/algorithms/mergeSort")).mergeSort(data),
    quickSort: async (data: number[]) =>
      (await import("@/utils/algorithms/quickSort")).quickSort(data),
  };

  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const executeAlgorithm = async () => {
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
  }, [isSorting, algorithm.key]);

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

    const renderArrayWithValues = (data: number[], highlightedIndices: number[] = [], pivotIndex: number | null = null) => {
      const maxVal = Math.max(...data);
      const barWidth = width / data.length;

      const bars = svg.selectAll("rect").data(data);

      bars
        .enter()
        .append("rect")
        .merge(bars)
        .attr("x", (_, i) => i * barWidth)
        .attr("y", (d) => maxBarHeight - (d / maxVal) * maxBarHeight)
        .attr("width", barWidth - 2)
        .attr("height", (d) => (d / maxVal) * maxBarHeight)
        .attr("fill", (_, i) => (highlightedIndices.includes(i) ? "#00ff99" : "steelblue"));

      // Add or update pivot point indicator (optional)
      if (pivotIndex !== null) {
        // Remove any existing pivot lines before adding new ones
        svg.selectAll(".pivot").remove();

        svg
          .selectAll(".pivot")
          .data([pivotIndex])
          .enter()
          .append("line")
          .merge(svg.selectAll(".pivot"))
          .attr("x1", (d) => d * barWidth + barWidth / 2)
          .attr("y1", 0)
          .attr("x2", (d) => d * barWidth + barWidth / 2)
          .attr("y2", maxBarHeight)
          .attr("stroke", "red")
          .attr("stroke-width", 2)
          .attr("class", "pivot");
      }

      // Remove old pivot lines and text elements
      bars.exit().remove();
    };

    let stepIndex = 0;
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Renders the current step of the sorting visualization.
 * 
 * Checks if sorting is paused or completed. If not, it proceeds to render
 * the current step's array with highlighted indices and pivot index.
 * Advances the step index and schedules the next render based on the
 * specified speed unless the sorting is paused or completed.
 * 
 * On completion, updates the sorting state and calculates the elapsed
 * sorting time.
 */

/******  abb31234-e77a-4671-9a19-d1ff2c6e798d  *******/
    const renderStep = () => {
      if (isPaused || !isSorting) return;

      const step = currentSteps[stepIndex];
      renderArrayWithValues(step.array, step.highlightedIndices, step.pivotIndex);

      stepIndex++;
      if (stepIndex < currentSteps.length && !isPaused) {
        if (speed === 1) {
          setTimeout(renderStep, speed); // Adjust the timeout to control the speed of rendering
        }
        else if (speed === 0.75) {
          setTimeout(renderStep, 25/speed); // Adjust the timeout to control the speed of rendering
        }
        else if (speed === 0.5) {
          setTimeout(renderStep, 50/speed); // Adjust the timeout to control the speed of rendering
        }
        else if (speed === 0.25) {
          setTimeout(renderStep, 100/speed); // Adjust the timeout to control the speed of rendering
        }
      } else {
        setSorting(false);
        setSortingComplete(true);
        const endTime = Date.now(); // Capture end time
        const elapsedTime = (endTime - (startTimeRef.current ?? endTime)) / 1000; // Time in seconds
        setSortingTime(elapsedTime); // Set sorting time
      }
    };

    if (sorting) {
      renderStep();
    }
  }, [currentSteps, isPaused, sorting, speed]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Conditionally render SVG elements based on sorting state */}
      {isSorting || sortingComplete ? (
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
      ) : (
        <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  );
}
