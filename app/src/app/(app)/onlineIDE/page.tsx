"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useSessionData } from "@/app/hooks/useSessionData";
import { useRouter } from "next/navigation";

function OnlineIDE() {
  const { session, status } = useSessionData();
  const router = useRouter();

  const [userStatus, setUserStatus] = useState(false);
  const [selectedTab, setSelectedTab] = useState("1");
  const [editorContent, setEditorContent] = useState<Record<string, string>>({});
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");

  const tabs = [
    { id: "1", label: "Python", key: "python", language_id: 71 },
    { id: "2", label: "Java", key: "java", language_id: 62 },
    { id: "3", label: "C", key: "c", language_id: 50 },
    { id: "4", label: "C++", key: "cpp", language_id: 54 },
    { id: "5", label: "C#", key: "csharp", language_id: 51 },
    { id: "6", label: "JavaScript", key: "javascript", language_id: 63 },
  ];

  useEffect(() => {
    if (status === "authenticated") {
      setUserStatus(true);
      setEditorContent(
        tabs.reduce((acc, tab) => ({ ...acc, [tab.key]: `// Write your ${tab.label} code here` }), {})
      );
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;

  if (status === "unauthenticated") {
    router.replace("/sign-in");
    return <div>Please log in to access this feature</div>;
  }

  const handleRunCode = async () => {
    const currentTab = tabs.find((tab) => tab.id === selectedTab);
    if (!currentTab) return;

    const code = editorContent[currentTab.key];
    const API_URL = "https://judge0-ce.p.rapidapi.com/submissions";
    const API_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY;

    try {
      const response = await axios.post(
        API_URL,
        {
          source_code: code,
          language_id: currentTab.language_id,
          stdin: stdin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": API_KEY,
          },
        }
      );

      const { token } = response.data;

      const result = await axios.get(`${API_URL}/${token}`, {
        headers: {
          "X-RapidAPI-Key": API_KEY,
        },
      });

      setOutput(result.data.stdout || result.data.stderr || "No output");
    } catch (error: any) {
      setOutput(`Error: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Tabs */}
      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`px-4 py-2 rounded-t-md ${
              selectedTab === tab.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="w-full max-w-4xl mx-auto">
        <Editor
          height="60vh"
          defaultLanguage={tabs.find((tab) => tab.id === selectedTab)?.key || "javascript"}
          value={editorContent[tabs.find((tab) => tab.id === selectedTab)?.key || ""]}
          onChange={(value) =>
            setEditorContent((prev) => ({
              ...prev,
              [tabs.find((tab) => tab.id === selectedTab)?.key || ""]: value || "",
            }))
          }
          theme="vs-dark"
        />
      </div>

      {/* Input (stdin) */}
      <textarea
        placeholder="Enter input for the program (stdin)"
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
        className="w-full max-w-4xl h-24 mt-4 p-3 border border-gray-300 rounded-md bg-white shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Run Button */}
      <button
        onClick={handleRunCode}
        className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
      >
        Run Code
      </button>

      {/* Output */}
      <div className="w-full max-w-4xl mt-6 p-4 bg-white border border-gray-300 rounded-md shadow-md">
        <h2 className="text-lg font-semibold text-gray-700">Output:</h2>
        <pre className="mt-2 bg-gray-100 p-3 rounded-md text-sm text-gray-800 overflow-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}

export default OnlineIDE;
