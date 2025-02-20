"use client";
import AlgorithmSelector from "@/components/Algorithm/algorithmSelector";
import React, { useState } from "react";

const AlgorithmPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
 

  return (
    <div className="flex h-screen bg-slate-200">
 <div className="flex-col bg-slate-200 h-[fit-content] w-full ">
      <div className="container w-ful h-fulll">
       
        <div className="flex flex-col font-bold text-3xl text-white m-0 p-1 lg:p-3 justify-center w-full ">
          
          <AlgorithmSelector
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
        </div>
      </div>
    </div>
    </div>
   
  );
};

export default AlgorithmPage;
