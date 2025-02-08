"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HoverEffect } from "@/components/ui/hoverEffect"; // Ensure correct import path
import { PlaceholdersAndVanishInput } from "../ui/placeholder-and-vanish-input";

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


  const placeholders = [
    "Selection Sort Algorithm",
    "Merge Sort Algorithm",
    "Radix Sort Algorithm",
    "Heap Sort Algorithm",
    "Bogo Sort Algorithm",
  ];

  useEffect(() => {
    setIsMounted(true);
    const fetchAlgorithms = async () => {
      const response = await fetch("/data/algorithms.json");
      const data = await response.json();
      setAlgorithms(data);
    };

    fetchAlgorithms();
  }, []);

  if (!isMounted || algorithms.length === 0) {
    return <div className="text-center h-screen">Loading...</div>;
  }

  const handleAlgorithmSelection = (key: string) => {
    setSelectedAlgorithm(key);
    const selectedAlgorithm = algorithms.find((algo) => algo.key === key);
    if (selectedAlgorithm) {
      router.push(selectedAlgorithm.route);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredAlgorithms = algorithms.filter((algo) =>
    algo.name.toLowerCase().includes(searchQuery)
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchQuery(e.currentTarget.value.toLowerCase());
  };

  return (
    <div className="p-6 w-full ">
      <h1 className="text-2xl text-gray-700 font-bold text-center mb-6">Select an Algorithm</h1>

      {/* Search Bar */}
      <div className="m-auto w-full text-center mb-4">
        {/* <input
          type="text"
          placeholder="Search algorithm by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-[80%] lg:w-[40%] p-2 border text-sm text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        /> */}
         <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleSearch}
        onSubmit={(e) => onSubmit(e)}
      />
      </div>

      {/* Algorithm Cards with Hover Effect */}
      <HoverEffect
        items={filteredAlgorithms.map((algo) => ({
          title: algo.name,
          description: algo.description,
          image: algo.image,
          link: algo.route, // Fix: Now correctly navigates
        }))}
        className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center w-full"
      />
    </div>
  );
}
