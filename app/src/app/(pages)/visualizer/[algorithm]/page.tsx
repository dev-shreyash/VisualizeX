"use client"; // Ensures the component is a client-side component

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation"; // Correct import for useParams
import { use, useEffect, useState } from "react";
import EnterDataPopup from "@/components/other/enterDataPopup";
import Visualizer from "@/components/Algorithm/visualizer"; // Import the Visualizer component
import CodeTabs from "@/components/other/codetabs";
import { set } from "zod";
import ArrayVisualizer from "@/components/Algorithm/arrayVisualizer";
import LogViewer from "@/components/Algorithm/logViewer";
import AlgoInfo from "@/components/Algorithm/AlgoInfo";
import ArrayLengthPopup from "@/components/other/enterArrayLengthPopup";
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
  const [steps, setSteps] = useState<{ array: number[] }[]>([]); // Store the steps for visualization
  const [isPaused, setIsPaused] = useState(false);
  const [sortingTime, setSortingTime] = useState<number | null>(null); // State to store sorting time

  const [showPopup, setShowPopup] = useState(false);

  const [isSorting, setIsSorting] = useState(false); // State to control sorting
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [userData, setUserData] = useState<number[]>([]);  // Default as an empty array
  const [lengthOfArray, setLengthOfArray] = useState(0); // Default value as 0
  const [speed, setSpeed] = useState(1); // Default value as 1

  // UseEffect to load initial data from localStorage (only on client side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      //console.log("Fetching data from localStorage...");

      const storedUserData = localStorage.getItem("userData");
      const storedLength = localStorage.getItem("LengthOfArray");
      const storedSpeed = localStorage.getItem("speed");

      // console.log("Stored Data - userData:", storedUserData);
      // console.log("Stored Data - LengthOfArray:", storedLength);
      // console.log("Stored Data - speed:", storedSpeed);

      if (storedUserData) {
        try {
          setUserData(JSON.parse(storedUserData)); // Parse and set userData
        } catch (error) {
          console.error("Error parsing userData:", error);
        }
      }

      if (storedLength) {
        setLengthOfArray(Number(storedLength)); // Convert and set lengthOfArray
      }

      if (storedSpeed) {
        setSpeed(Number(storedSpeed)); // Convert and set speed
      }
    }
  }, []); // Empty dependency array means this runs only once after component mounts

  // Save state to localStorage whenever it changes (client side)
  useEffect(() => {
    if (typeof window !== "undefined") {
      // console.log("Saving userData to localStorage:", userData);
      if (userData.length > 0) {
        localStorage.setItem("userData", JSON.stringify(userData));
      }
    }
  }, [userData]); // Run when userData changes

  useEffect(() => {
    if (typeof window !== "undefined") {
     // console.log("Saving LengthOfArray to localStorage:", lengthOfArray);
      if (lengthOfArray !== null) {
        localStorage.setItem("LengthOfArray", String(lengthOfArray));
      }
    }
  }, [lengthOfArray]); // Run when lengthOfArray changes

  useEffect(() => {
    if (typeof window !== "undefined") {
      //console.log("Saving speed to localStorage:", speed);
      if (speed !== null) {
        localStorage.setItem("speed", String(speed));
      }
    }
  }, [speed]); // Run when speed changes





  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleSubmitData = (data: number[]) => {
    setUserData(data);
  };

  useEffect(() => {
    setIsSorting(false);
  }, [userData]);

  useEffect(() => {
    if (isPaused) {
      window.location.reload();
    }
  }, [isPaused]);

  const handlePopupSubmit = (length: number) => {
    setLengthOfArray(length);
  };

  useEffect(() => {
    if (lengthOfArray > 0) {
      const newArray = Array.from({ length: lengthOfArray }, () =>
        Math.floor(Math.random() * 90 + 10)
      );
      setUserData(newArray);
    }
  }, [lengthOfArray]);

  const generateArray = () => {
    setIsSorting(false);
    setSortingTime(null);

    if (isSorting) {
      return;
    }
    setIsPopupOpen(true);
  };

  const resetArray = () => {
    setUserData([]);
    setIsSorting(false); // Reset sorting state
  };

  const handleStartSorting = () => {
    if (userData.length === 0) {
      return;
    }
    setIsPaused(false);
    setIsSorting(true);
  };

  const handlePauseSorting = () => {
    // if (!isSorting) {
    //   return;
    // }
    setIsPaused(true);
    setIsSorting(false);
  };

  useEffect(() => {
    console.log(isPaused);
  }, [isPaused]);

  const handleSortingComplete = (time: number) => {
    setSortingTime(time);
    setIsSorting(false);
    // Set sorting time in the parent component
  };

  // const handleCurrentSteps = (array: number[]) => {
  //   setCurrentSteps([{ array }]);
  // }

  useEffect(() => {
    // Reset sorting time when speed changes
    setSortingTime(null);
  }, [speed]);
  // Fetch algorithm data from the JSON file
  useEffect(() => {
    const fetchAlgorithmData = async () => {
      const response = await fetch("/data/algorithms.json");
      const data = await response.json();
      // Find the selected algorithm by key
      const selectedAlgorithm = data.find(
        (algo: Algorithm) => algo.key === algorithm
      );
      setAlgorithmData(selectedAlgorithm || null);
    };

    fetchAlgorithmData();
    setIsMounted(true); // Set to true once the component is mounted
  }, [algorithm]);

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
      <h1 className="text-3xl font-bold text-center mb-4">
        {algorithmData.name}
      </h1>
      <p className="text-gray-600 text-center mb-8">
        {algorithmData.description}
      </p>
  
      <div className="flex flex-col gap-8">
        {/* Control Panel */}
        <div className="p-4 border rounded-md shadow-md flex flex-col sm:flex-row m-auto w-full sm:w-[80%] items-center justify-center gap-8">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="container flex flex-col sm:flex-row gap-2 items-center">
            <Button disabled={isSorting} onClick={generateArray}>
              Generate New Array
            </Button>
            {isPopupOpen && (
              <ArrayLengthPopup
                onClose={() => setIsPopupOpen(false)}
                onSubmit={handlePopupSubmit}
              />
            )}
            OR
            <Button
              disabled={isSorting}
              color="primary"
              onClick={handleOpenPopup}
            >
              Enter Data
            </Button>
            {showPopup && (
              <EnterDataPopup
                onClose={handleClosePopup}
                onSubmit={handleSubmitData}
              />
            )}
          </div>
  
          <Button
            disabled={isSorting || userData.length === 0}
            onClick={resetArray}
          >
            Clear Array
          </Button>
          <Button
            disabled={isSorting || userData.length === 0}
            onClick={handleStartSorting}
          >
            Sort Array
          </Button>
          <Button
            disabled={isSorting || userData.length === 0}
            onClick={handleStartSorting}
          >
            Play
          </Button>
          <Button
            disabled={!isSorting || userData.length === 0}
            onClick={handlePauseSorting}
          >
            Pause
          </Button>
  
          <div className="relative w-full sm:w-1/2 flex flex-col items-center justify-center group-hover:block">
            <input
              type="range"
              min="0.00"
              max="1.00"
              value={speed}
              step="0.25"
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-4 bg-gray-300 rounded-lg outline-none opacity-70 transition-opacity duration-200 hover:opacity-100"
              title="Speed Control"
              disabled={isSorting} // Disable the range input when isSorting is true
            />
            <div className="flex items-center text-sm">Speed</div>
            {/* Tooltip */}
            <div
              className="absolute bottom-8 text-sm bg-gray-700 text-white px-2 py-1 rounded shadow-md"
              style={{
                marginBottom: "1rem",
                left: `${((speed - 0.0) * 100) / (1.0 - 0.0)}%`, // Adjusted calculation for 0.25 to 1.00 range
                transform: "translateX(-50%)",
              }}
            >
              {speed === 0.0 ? "Voice" : `${speed.toFixed(2)}x`}
            </div>
          </div>
        </div>
  
        {/* Visualization Windows */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex flex-col gap-3 w-full lg:w-[60%]">
            <div className="flex-1 p-4 border rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Bar Chart Visualization
              </h2>
              <div
                id="barChart"
                className="flex flex-col justify-center h-64 w-full p-4 bg-gray-100 items-center"
              >
                <Visualizer
                  // steps={steps}
                  isSorting={isSorting}
                  isPaused={isPaused}
                  speed={speed}
                  userData={userData}
                  algorithm={algorithmData}
                  onSortingComplete={handleSortingComplete}
                  currentSteps={function (array: number[]): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
              {/* Display sorting time */}
              {sortingTime !== null && (
                <div className="m-2 flex justify-end">
                  Sorting completed in {sortingTime} seconds. speed {speed}X
                </div>
              )}
             <div className="flex h-full gap-3 p-4 lg:text-lg sm:text-xxs w-full">
  <div className="flex-col">
    <div className="flex gap-2 items-center m-auto">
      <div className="w-4 h-4 rounded-lg bg-[#ffcc00]"></div>
      <p className="lg:text-lg sm:text-xxs">- Pivot</p>
    </div>
    <div className="flex gap-2 items-center">
      <div className="w-4 h-4 rounded-lg bg-[#ff5733]"></div>
      <p className="lg:text-lg sm:text-xxs">- Current left Index</p>
    </div>
    <div className="flex gap-2 items-center">
      <div className="w-4 h-4 rounded-lg bg-sky-300"></div>
      <p className="lg:text-lg sm:text-xxs">- Current right Index</p>
    </div>
  </div>
  <div className="flex-col">
    <div className="flex gap-2 items-center">
      <div className="w-4 h-4 rounded-lg bg-blue-700"></div>
      <p className="lg:text-lg sm:text-xxs">- Comparison</p>
    </div>
    <div className="flex gap-2 items-center">
      <div className="w-4 h-4 rounded-lg bg-black"></div>
      <p className="lg:text-lg sm:text-xxs">- Swap</p>
    </div>
  </div>
</div>

            </div>
  
            <div className="flex-1 p-4 border rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Array Visualization
              </h2>
              <div id="arrayView" className="h-14 w-full p-4 bg-gray-100 overflow-hidden  sm:text-sm">
                <ArrayVisualizer
                  // steps={steps}
                  isSorting={isSorting}
                  isPaused={isPaused}
                  speed={speed}
                  userData={userData}
                  algorithm={algorithmData}
                  onSortingComplete={function (time: number): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </div>
            <div className="flex-1 p-4 border rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                User Data (Original Array)
              </h2>
              <div id="LogView" className="w-full bg-gray-100">
                <div className="bg-gray-800 text-white p-4 rounded-md overflow-clip">
                  <div className="flex flex-wrap gap-2">
                    {userData.map((num, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 flex items-center justify-center border rounded bg-gray-100 text-black"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="flex-1 p-4 border rounded-md shadow-md w-full lg:w-[40%]">
            <h2 className="text-xl font-semibold mb-4">Steps Viewer</h2>
            <div id="LogView" className="w-full bg-gray-100">
              <LogViewer
                //steps={steps}
                isSorting={isSorting}
                isPaused={isPaused}
                speed={speed}
                userData={userData}
                algorithm={algorithmData}
              />
            </div>
          </div>
        </div>
  
        <div className=" flex flex-col lg:flex-row gap-3 ">
          <AlgoInfo algorithm={algorithmData} />
          <div className="flex-1 p-4 border rounded-md shadow-md w-full lg:w-[40%]">
            <h2 className="text-xl font-semibold mb-4">Algorithm Code</h2>
            <pre className="bg-gray-800 text-white p-4 rounded-md">
              <div className="flex flex-wrap gap-2">
                <CodeTabs algorithm={algorithmData} />
                <hr />
              </div>
            </pre>
            <h1>
              Are you a coder?{" "}
              <a href="/onlineIDE" className="text-blue-500 underline">
                Try out our online IDE
              </a>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
  
}
