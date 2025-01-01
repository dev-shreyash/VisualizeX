import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import React, { useEffect, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // Import the desired theme

// Props to receive algorithm data
interface CodeTabsProps {
  algorithm: { key: string; name: string; description: string; image: string; route: string };
}

const CodeTabs = ({ algorithm }: CodeTabsProps) => {
  const [algorithmData, setAlgorithmData] = useState<any | null>(null);
  const [selectedTab, setSelectedTab] = useState("1");

  useEffect(() => {
    const fetchAlgorithmData = async () => {
      const response = await fetch("/data/algorithmCode.json");
      const data = await response.json();
      // Find the selected algorithm by key
      const selectedAlgorithm = data.find(
        (item: { key: string }) => item.key === algorithm.key
      );
      setAlgorithmData(selectedAlgorithm || null);
    };

    fetchAlgorithmData();
  }, [algorithm]);

  useEffect(() => {
    // Apply syntax highlighting after the content is loaded
    if (algorithmData) {
      hljs.highlightAll();
    }
  }, [algorithmData, selectedTab]); // This will run every time the algorithm data changes

  const tabs = [
    { id: "1", label: "Python", key: "python" },
    { id: "2", label: "Java", key: "java" },
    { id: "3", label: "C", key: "c" },
    { id: "4", label: "C++", key: "cpp" },
    { id: "5", label: "C#", key: "csharp" },
    { id: "6", label: "JavaScript", key: "javascript" },
  ];

  return (
    <Tabs className="overflow-hidden" selectedIndex={Number(selectedTab) - 1}>
      <TabList className="flex space-x-1 gap-6 rounded-xlp-1 font-bold overflow-auto no-scrollbar">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            className={`px-2 cursor-pointer ${
              selectedTab === tab.id
                ? "text-white outline-none px-2 underline"
                : "text-gray-400 underline-none"
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>

      {tabs.map((tab) => (
        <TabPanel key={tab.id}>
          <pre className="w-full p-2 overflow-auto">
            <code className={`language-${tab.key}`}>{algorithmData?.[tab.key]}</code>
          </pre>
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default CodeTabs;
