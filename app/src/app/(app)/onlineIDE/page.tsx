"use client";

import React, { use, useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useSessionData } from "@/app/hooks/useSessionData";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { set } from "zod";
import Image from "next/image";
import { saveCode } from "@/helper/saveCode";
import { useToast } from "@/components/ui/use-toast";

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

  const [code, setCode] = useState<string>("");

  const [username, setUserName] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const tabs = [
    { id: "1", label: "Python", key: "python" },
    { id: "6", label: "JavaScript", key: "javascript" },
  ];
  // State to store the window width
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);

  // Use useEffect to listen to window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Determine height based on window size
  const editorHeight = windowWidth >= 1024 ? "90vh" : "40vh";
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
    setUserName(session?.user.username || "");
    setLanguage(tabs.find((tab) => tab.id === selectedTab)?.key || "");
  }, [username, language, tabs]);

  useEffect(() => {
    if (status === "authenticated") {
      setUserStatus(true);
      console.log(username, language);
      if (!username || !language) return; // Skip if either is missing

      let isMounted = true; // To prevent state updates after unmount

      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/code/${username}`, {
          params: { language },
        })
        .then((response) => {
          console.log("user code", response.data[0]?.code);
          if (response.data[0]?.code === undefined) {
            setEditorContent(
              tabs.reduce(
                (acc, tab) => ({
                  ...acc,
                  [tab.key]: `${commentSymbols}Write your ${tab.label} code here\n${commentSymbols}sort the below given array with bubble sort\narr=[${userData}]\n`,
                }),
                {}
              )
            );
          } else {
            setEditorContent(
              tabs.reduce(
                (acc, tab) => ({
                  ...acc,
                  [tab.key]: `${response.data[0]?.code}`,
                }),
                {}
              )
            );
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError("Failed to fetch code");
            console.error(err);
          }
        });
    }
  }, [status, commentSymbols, userData, username, language]);

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

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/execute",
        {
          code,
          language,
          inputs: stdin,
        }
      );

      console.log("Backend Response:", response.data); // Log the backend response

      // Check if the response has the expected structure
      if (response.data && response.data.status === 200) {
        // Properly append the result to the terminal history
        setTerminalHistory((prev) => [...prev, `>>${response.data.result}`]);
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

      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/execute",
        {
          code,
          language,
          inputs: input,
        }
      );

      console.log("Backend Response:", response.data); // Log the backend response

      // Check if the response has the expected structure
      if (response.data && response.data.status === 200) {
        // Properly append the result to the terminal history
        setTerminalHistory((prev) => [...prev, ` ${response.data.result}`]);
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

  const handleSubmitCode = async () => {
    const code = editorContent?.[language];
    console.log(code);
    console.log(language, username);
    if (language && username && code) {
      const result = await saveCode(language, username, code);

      if (result.message) {
        toast({
          title: "Success",
          description: result.message,
          variant: "default",
        });
      } else if (result.error) {
        toast({
          title: "Failed to save code",
          description: result.message,
          variant: "destructive",
        });
      }
    } else {
      alert("Please provide valid code, username, and language.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-4 w-full">
      <div className="flex-col w-full border bg-slate-200 rounded-md shadow-md pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:px-2 sm:py-2">
          {/* Tabs */}
          <div className="flex space-x-4 w-full sm:w-auto sm:flex-1 p-2 m-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 m-0 w-full sm:w-auto h-9 shadow-md ${
                  selectedTab === tab.id
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <h1 className="text-sm sm:text-base">User: {session?.user.email}</h1>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center sm:px-4 sm:py-2">
          <div className="flex w-[60%] justify-between">

            <div className="flex w-3 sm:w-0 sm:hidden"></div>

            {/* Run Button */}
           <Button
            onClick={handleRunCode}
            className="px-6 py-2 text-white font-semibold rounded-md shadow-md hover:bg-emerald-500 mt-4 sm:mt-0"
          >
            Run Code
          </Button>
          </div>
           
          <div className="relative group">
            <button onClick={handleSubmitCode} className="p-2 flex items-center">
              <Image
                src={"/images/save.svg"}
                alt="save"
                width={30}
                height={30}
                className="rounded-full cursor-pointer"
              /> Save code
            </button>
            <div className="absolute left-1/2 w-20 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
              Save code
            </div>
          </div>
        </div>

        <div className="flex flex-col p-3 sm:flex-row mt-4 gap-4 sm:gap-8">
        {/* Editor for all screen sizes with different heights for sm and lg */}
        <div className="w-full max-w-4xl mx-auto shadow-md">
      <Editor
        height={editorHeight} // Dynamically set the height based on screen size
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
            [tabs.find((tab) => tab.id === selectedTab)?.key || ""]: value || "",
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
          <div className="w-full sm:w-1/2 max-w-4xl mx-auto p-4 bg-gray-800 text-gray-300 border border-gray-300 h-[90vh] overflow-auto">
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
