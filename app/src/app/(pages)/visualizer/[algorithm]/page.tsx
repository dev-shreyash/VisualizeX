"use client"; // Ensures the component is a client-side component

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation"; // Correct import for useParams
import { useEffect, useState } from "react";

// Interface for the algorithm data
interface Algorithm {
  key: string;
  name: string;
  description: string;
  image: string;
  route: string;
}

export default function AlgorithmVisualization() {
  const { algorithm } = useParams(); // Use useParams to get the dynamic route parameter
  const [isMounted, setIsMounted] = useState(false);
  const [algorithmData, setAlgorithmData] = useState<Algorithm | null>(null);


  // Fetch algorithm data from the JSON file
  useEffect(() => {
    const fetchAlgorithmData = async () => {
      const response = await fetch("/data/algorithms.json");
      const data = await response.json();
      console.log(data)

      // Find the selected algorithm by key
      const selectedAlgorithm = data.find((algo: Algorithm) => algo.key === algorithm);
      console.log(selectedAlgorithm)
      setAlgorithmData(selectedAlgorithm || "BubbleSort");
    };

    fetchAlgorithmData();
    setIsMounted(true); // Set to true once the component is mounted
  }, [algorithm]); // Depend on `algorithm` to refetch when route changes
 console.log("algorithem data",algorithmData)
  // Handle case where data is undefined or still loading
  if (!isMounted || !algorithmData) {
    return (
      <p className="flex h-screen justify-center items-center font-bold text-3xl text-center text-white">
        Loading...
      </p>
    );
  }

  return (
    <div className="p-6 bg-slate-200">
    <h1 className="text-3xl font-bold text-center mb-4">{algorithmData.name}</h1>
    <p className="text-gray-600 text-center mb-8">{algorithmData.description}</p>
  
    <div className="flex flex-col gap-8">
      {/* Control Panel */}
      <div className="p-4 border rounded-md shadow-md flex items-center gap-8">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        <div className="container flex gap-2 items-center">
        <Button>Generate New Array</Button>
        OR
        <Button>Enter Data</Button>
        </div>
       
        <Button>Reset Array</Button>
        <Button>Sort Array</Button>
        <Button>Play</Button>
        <Button>Pause</Button>

       
        <input
          type="range"
          min="1"
          max="100"
          className="mt-4 "
          title="Speed Control"
        />
      </div>
  
      {/* Visualization Windows */}
       <div className="container flex">
        <div className="flex-col">
        <div className="flex-1 p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bar Chart Visualization</h2>
        <div id="barChart" className="h-64 w-full bg-gray-100"></div>
      </div>
  
      <div className="flex-1 p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Array Visualization</h2>
        <div id="arrayView" className="h-64 w-full bg-gray-100"></div>
      </div>
        </div>
     
  
      <div className="flex-1 p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Algorithm Code</h2>
        <pre className="bg-gray-800 text-white p-4 rounded-md">
          {/* Insert algorithm code here */}
        </pre>
      </div>
       </div>
      
    </div>
  </div>
  
  );
}
