"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useSessionData } from "@/app/hooks/useSessionData";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function OnlineIDE() {
  const { session, status } = useSessionData();
  const router = useRouter();

  const [userStatus, setUserStatus] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const [editorContent, setEditorContent] = useState<Record<string, string>>(
    {}
  );
  const [stdin, setStdin] = useState("");
  const [commentSymbols, setCommentSymbols] = useState<string[]>([]);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]); // Terminal History
  const [userData, setUserData] = useState<number[]>([]); // Initialized to an empty array

  const tabs = [
    { id: "1", label: "Python", key: "python" },
    { id: "6", label: "JavaScript", key: "javascript" },
  ];

  // Handle localStorage on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage?.getItem("userData");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    }
  }, []);

  useEffect(() => {
    if (selectedTab === "1") {
      setCommentSymbols(["#"]);
    } else {
      setCommentSymbols(["//"]);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (status === "authenticated") {
      setUserStatus(true);
      setEditorContent(
        tabs.reduce(
          (acc, tab) => ({
            ...acc,
            [tab.key]: `${commentSymbols}Write your ${tab.label} code here\n${commentSymbols}sort the below given array with bubble sort\narr=[${userData}]\n`,
          }),
          {}
        )
      );
    }
  }, [status, commentSymbols, userData]);

  const handleRunCode = async () => {
    const currentTab = tabs.find((tab) => tab.id === selectedTab);
    if (!currentTab) return;

    const code = editorContent[currentTab.key];
    const language = currentTab.key;

    try {
      console.log("Sending code execution request...");
      console.log("Code:", code);
      console.log("Language:", language);
      console.log("Input:", stdin);

      const response = await axios.post("http://localhost:5000/execute", {
        code,
        language,
        inputs: stdin,
      });

      console.log("Backend Response:", response.data); // Log the backend response

      // Check if the response has the expected structure
      if (response.data && response.data.status === 200) {
        // Properly append the result to the terminal history
        setTerminalHistory((prev) => [
          ...prev,
          `>>${response.data.result}`,
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          `Error: ${response.data.error}`,
        ]);
      }
    } catch (error: any) {
      console.log("Error:", error); // Log the error
      setTerminalHistory((prev) => [...prev, `Error: ${error.message}`]);
    }
  };

  const handleTerminalInput = async (input: string) => {
    setTerminalHistory((prev) => [...prev, `> ${input}`]); // Add user input to history
    setStdin(""); // Clear input after submitting

    try {
      const currentTab = tabs.find((tab) => tab.id === selectedTab);
      const code = editorContent[currentTab?.key || "python"];
      const language = currentTab?.key || "python";

      console.log("Sending terminal input...");
      console.log("Code:", code);
      console.log("Language:", language);
      console.log("Input:", input);

      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/execute", {
        code,
        language,
        inputs: input,
      });

      console.log("Backend Response:", response.data); // Log the backend response

      // Check if the response has the expected structure
      if (response.data && response.data.status === 200) {
        // Properly append the result to the terminal history
        setTerminalHistory((prev) => [
          ...prev,
          ` ${response.data.result}`,
        ]);
      } else {
        setTerminalHistory((prev) => [
          ...prev,
          `Error: ${response.data.error}`,
        ]);
      }
    } catch (error: any) {
      console.log("Error:", error); // Log the error
      setTerminalHistory((prev) => [...prev, `Error: ${error.message}`]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && stdin.trim()) {
      handleTerminalInput(stdin); // Call function to handle terminal input
    }
  };

  if (status === "loading") return <div>Loading...</div>;

  if (status === "unauthenticated") {
    router.replace("/sign-in");
    return <div>Please log in to access this feature</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 p-4 w-full">
      <div className="flex-col w-full border bg-slate-200 rounded-md shadow-md pb-4">
        <div className="flex">
        <div className="flex items-center p-0 justify-between w-full max-w-4xl">
          {/* Tabs */}
          <div className="flex  space-x-4 w-20px  p-4 m-2 ">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 m-0 w-full h-9 shadow-md ${
                  selectedTab === tab.id
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Run Button */}
          <Button
            onClick={handleRunCode}
            className=" px-6 py-2 text-white font-semibold rounded-md shadow-md hover:bg-emerald-500"
          >
            Run Code
          </Button>

        </div>
        <div className="flex w-full max-w-4xl justify-end items-center ">
            <h1>User:{session?.user.email}</h1>
        </div>
        </div>
        

        <div className="flex">
          {/* Editor */}
          <div className="w-full max-w-4xl mx-auto mt-4 shadow-md">
            <Editor
              height="90vh"
              
              defaultLanguage={
                tabs.find((tab) => tab.id === selectedTab)?.key || "javascript"
              }
              value={
                editorContent[
                  tabs.find((tab) => tab.id === selectedTab)?.key || ""
                ]
              }
              onChange={(value) =>
                setEditorContent((prev) => ({
                  ...prev,
                  [tabs.find((tab) => tab.id === selectedTab)?.key || ""]:
                    value || "",
                }))
              }
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                wordWrap: "on",
                wordWrapColumn: 80,
              }}
            />
          </div>

          {/* Terminal */}
          <div className="w-full max-w-4xl mx-auto mt-4 p-4 bg-gray-800 text-gray-300 border border-gray-300 h-[90vh] overflow-auto">
            <pre>&gt;&gt;</pre>
            <div className="terminal-output mb-4">
              {terminalHistory.map((line, index) => (
                <pre key={index} className="text-gray-300">
                  {line}
                </pre>
              ))}
            </div>

            <input
              type="text"
              value={stdin}
              onKeyDown={handleKeyPress}
              onChange={(e) => setStdin(e.target.value)}
              className="w-full p-2 font-terminal bg-inherit focus:outline-none"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnlineIDE;
