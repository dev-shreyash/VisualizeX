import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import React, { useEffect, useState } from "react";

//props to recieve algorithm data

interface CodeTabsProps {
  
    algorithm: { key: string; name: string; description: string; image: string; route: string };
   
  }
const CodeTabs = ({
    algorithm
}:CodeTabsProps) => {
    const [algorithmData, setAlgorithmData] = React.useState<Algorithm | null>(null);
    const [isMounted, setIsMounted] = useState(false);


      useEffect(() => {
        const fetchAlgorithmData = async () => {
          const response = await fetch("/data/algorithmCode.json");
          const data = await response.json();
          // Find the selected algorithm by key
          const selectedAlgorithm = data.find(
            (algo: Algorithm) => algo === algorithm
          );
          setAlgorithmData(selectedAlgorithm || null);
        };
    
        fetchAlgorithmData();
        setIsMounted(true); // Set to true once the component is mounted
      }, [algorithm]);

      console.log(algorithmData)


  return (
    <Tabs>
        <p>{algorithm.key}</p>
      <TabList className={"flex space-x-1 gap-6 rounded-xlp-1 font-bold"}>
        <Tab>Python</Tab>
        <Tab>Java</Tab>
        <Tab>C</Tab>
        <Tab>C++</Tab>
        <Tab>C#</Tab>
        <Tab>JavaScript</Tab>
      </TabList>
      <TabPanel>Content for Tab 1</TabPanel>
      <TabPanel>Content for Tab 2</TabPanel>
      <TabPanel>Content for Tab 3</TabPanel>
      <TabPanel>Content for Tab 4</TabPanel>
      <TabPanel>Content for Tab 5</TabPanel>
      <TabPanel>Content for Tab 6</TabPanel>
    </Tabs>
  );
};

export default CodeTabs;
