"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  const [searchQuery, setSearchQuery] = useState("");
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

  if (!isMounted || algorithms.length === 0) return <div className="text-center h-screen">Loading...</div>; // Prevent rendering until mounted and data is loaded.

  const handleAlgorithmSelection = (key: string) => {
    setSelectedAlgorithm(key);
    const selectedAlgorithm = algorithms.find((algo) => algo.key === key);
    if (selectedAlgorithm) {
      router.push(selectedAlgorithm.route); // Navigate to the visualization page.
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredAlgorithms = algorithms.filter((algo) =>
    algo.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold text-center mb-6">Select an Algorithm</h1>
      {/* Search Bar */}
      <div className="m-auto w-full text-center mb-4">
        <input
          type="text"
          placeholder="Search algorithm by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-[80%] lg:w-[40%] p-2 border text-sm text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center w-full ">
        {filteredAlgorithms.map((algo) => (
          <div
            key={algo.key}
            className={`h-[350px] bg-white border border-gray-300 rounded-md flex flex-col items-center gap-4 p-5 cursor-pointer shadow-md transition-transform duration-200 hover:shadow-lg hover:scale-105 ${
              selectedAlgorithm === algo.key ? "bg-blue-100 scale-105" : ""
            }`}
            onClick={() => handleAlgorithmSelection(algo.key)}
          >
            <Image
              src={algo.image}
              alt={`${algo.name} visualization`}
              className="w-full h-40 object-cover rounded-md hover:scale-105 transition-transform duration-200"
              width={400}
              height={300}
            />
            <span className="text-gray-700 text-lg font-semibold">{algo.name}</span>
            <p className="text-gray-500 text-sm text-center">{algo.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
