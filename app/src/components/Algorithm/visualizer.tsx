// components/Visualizer.tsx
import * as d3 from "d3";
import { useEffect, useRef } from "react";

interface VisualizerProps {
  steps: { array: number[]; comparison?: number[]; swapped?: number[]; sorted?: boolean }[];
}

export default function Visualizer({ steps }: VisualizerProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!steps || steps.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = 700;
    const height = 500;
    const barWidth = width / steps[0].array.length;

    svg.attr("width", width).attr("height", height).style("background", "#f0f0f0");

    let stepIndex = 0;

    function renderStep() {
      const step = steps[stepIndex];
      const bars = svg.selectAll("rect").data(step.array);

      // Render bars
      bars
        .join("rect")
        .attr("x", (_, i) => i * barWidth)
        .attr("y", (d) => height - d * 4.5)
        .attr("width", barWidth - 2)
        .attr("height", (d) => d * 10)
        .attr("fill", (_, i) =>
          step.sorted
            ? "green"
            : step.comparison?.includes(i)
            ? "orange"
            : step.swapped?.includes(i)
            ? "red"
            : "steelblue"
        );

      stepIndex++;
      if (stepIndex < steps.length) {
        setTimeout(renderStep, 500); // Delay between steps
      }
    }

    renderStep();
  }, [steps]);

  return <svg ref={svgRef}></svg>;
}
