"use client";
import AlgorithmSelector from "@/components/Algorithm/algorithmSelector";
import React, { useState } from "react";

const AlgorithmPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
 

  return (
    <div className="flex-col bg-slate-200 h-full w-full ">
      <div className="container w-full">
       
        <div className="flex flex-col font-bold text-3xl text-white m-0 p-3 justify-center w-full ">
          
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
        </div>
      </div>
    </div>
  );
};

export default AlgorithmPage;
