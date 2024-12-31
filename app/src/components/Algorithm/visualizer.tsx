import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { set } from "zod";

interface VisualizerProps {
  steps: { array: number[]; highlightedIndices: number[] }[]; // Highlighted indices for the current step
  isSorting: boolean;
  isPaused: boolean;
  speed: number;
  userData: number[];
  algorithm: { key: string; name: string; description: string; image: string; route: string };
  //onSortingComplete: () => void; // Callback when sorting completes
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
useEffect(()=>{
  setSortingComplete(false);
},[userData])

useEffect(()=>{
  setSortingTime(null);
},[userData])

useEffect(() => {
  if (sortingTime !== null) {
    onSortingComplete(sortingTime);
  }
}, [sortingTime]);


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
        .merge(bars) // Handle both entering and updating elements
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
          d3.select(this).attr("fill", "#e26fff"); // Highlight bar on hover
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

      // Remove extra bars
      bars.exit().remove();
    };

    // Initial render with userData
    renderArray(userData);

    // Render sorting steps
   // let stepIndex = 0;
    // const renderStep = () => {
    //   if (isPaused) return;
    //   const step = steps[stepIndex];
    //   const maxVal = Math.max(...userData);

    //   const bars = svg.selectAll("rect").data(step.array);

    //   bars
    //     .transition()
    //     .duration(speed) // Smooth transitions
    //     .attr("y", (d) => maxBarHeight - (d / maxVal) * maxBarHeight)
    //     .attr("height", (d) => (d / maxVal) * maxBarHeight)
    //     .attr("fill", "steelblue");

    //   stepIndex++;
    //   if (stepIndex < steps.length && isSorting && !isPaused) {
    //     setTimeout(renderStep, speed);
    //   }
    // };

    // if (isSorting && !isPaused) {
    //   renderStep();
    // }

    // Cleanup tooltip on unmount
    // return () => {
    //   tooltip.remove();
    // };
  }, [steps, isSorting, isPaused, speed, userData]);

  const svgRef1 = useRef<SVGSVGElement | null>(null);
  const [currentSteps, setCurrentSteps] = useState<{ array: number[]; highlightedIndices: number[] }[]>([]);
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
    const svgContainer = svgRef1.current?.parentElement;
    const width = svgContainer?.clientWidth ?? 0;
    const height = svgContainer?.clientHeight ?? 0;
    const maxBarHeight = height;

    const svg = d3.select(svgRef1.current);

    svg
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", "#f3f4f6");
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

    const renderArray = (data: number[], highlightedIndices: number[] = []) => {
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
        .attr("fill", (_, i) => (highlightedIndices.includes(i) ? "#00ff99" : "steelblue")) // Highlight bars
        .on("mouseover", function (event, d) {
          tooltip
            .style("opacity", 1)
            .text(d)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
          d3.select(this).attr("fill", "#e26fff");
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 20}px`);
        })
        .on("mouseout", function (_, i) {
          tooltip.style("opacity", 0);
          d3.select(this).attr("fill", highlightedIndices.includes(i) ? "#00ffff" : "steelblue");
        });

      bars.exit().remove();
    };

    let stepIndex = 0;
    const renderStep = () => {
      if (isPaused || !sorting) return;

      const step = currentSteps[stepIndex];
      renderArray(step.array, step.highlightedIndices);

      stepIndex++;
      if (stepIndex < currentSteps.length && !isPaused) {
        setTimeout(renderStep, speed);
      } else {
        setSorting(false);
        setSortingComplete(true); // Notify parent about completion
        const endTime = Date.now(); // Capture end time
        const elapsedTime = (endTime - (startTimeRef.current ?? endTime)) / 1000; // Time in seconds
        setSortingTime(elapsedTime); // Set sorting time
      }
    };

    if (sorting) {
      renderStep();
    }
  }, [userData,currentSteps, isPaused, sorting, speed,]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
    {/* Conditionally render SVG elements based on sorting state */}
    {isSorting || sortingComplete ? (
      
      <svg ref={svgRef1} style={{ width: "100%", height: "100%" }} />
    ) : (
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    )}
     
  </div>
  );
}
