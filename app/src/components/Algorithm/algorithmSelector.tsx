"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Algorithm {
  key: string;
  name: string;
  description: string;
  image: string;
  route: string;
}

interface AlgorithmSelectorProps {
  selectedAlgorithm: string;
  setSelectedAlgorithm: (algorithm: string) => void;
}

export default function AlgorithmSelector({
  selectedAlgorithm,
  setSelectedAlgorithm,
}: AlgorithmSelectorProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const router = useRouter();

  // Load algorithm data from JSON file
  useEffect(() => {
    setIsMounted(true); // Ensures the component is mounted.
    const fetchAlgorithms = async () => {
      const response = await fetch("/data/algorithms.json");
      const data = await response.json();
      setAlgorithms(data);
    };

    fetchAlgorithms();
  }, []);

  useEffect(() => {
    console.log("Selected Algorithm: ", selectedAlgorithm);
  }, [selectedAlgorithm]);

  if (!isMounted || algorithms.length === 0) return <div>Loading...</div>; // Prevent rendering until mounted and data is loaded.

  const handleAlgorithmSelection = (key: string) => {
    setSelectedAlgorithm(key);
    const selectedAlgorithm = algorithms.find((algo) => algo.key === key);
    if (selectedAlgorithm) {
      router.push(selectedAlgorithm.route); // Navigate to the visualization page.
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Select an Algorithm</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {algorithms.map((algo) => (
          <div
            key={algo.key}
            className={`container h-full w-[100%] bg-white border border-gray-300 rounded-md flex flex-col items-center gap-4 p-5 m-5 cursor-pointer shadow-md transition-transform duration-200 ${
              selectedAlgorithm === algo.key ? "bg-blue-100 border-blue-500 scale-105" : ""
            }`}
            onClick={() => handleAlgorithmSelection(algo.key)}
          >
            <img
              src={algo.image}
              alt={`${algo.name} visualization`}
              className="w-full h-40 object-cover rounded-md"
            />
            <span className="text-gray-700 text-lg font-semibold">{algo.name}</span>
            <p className="text-gray-500 text-sm text-center">{algo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
