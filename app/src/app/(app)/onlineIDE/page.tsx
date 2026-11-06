"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { useSessionData } from "@/app/hooks/useSessionData";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { saveCode } from "@/helper/saveCode";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface TabConfig {
  id: string;
  label: string;
  key: string;
  monacoLanguage: string;
  image: string;
  extension: string;
}

const TABS: TabConfig[] = [
  {
    id: "1",
    label: "Python",
    key: "python",
    monacoLanguage: "python",
    image: "/images/python.svg",
    extension: ".py",
  },
  {
    id: "2",
    label: "Java",
    key: "java",
    monacoLanguage: "java",
    image: "/images/java.svg",
    extension: ".java",
  },
  {
    id: "3",
    label: "C",
    key: "c",
    monacoLanguage: "c",
    image: "/images/c.svg",
    extension: ".c",
  },
  {
    id: "4",
    label: "C++",
    key: "cpp",
    monacoLanguage: "cpp",
    image: "/images/cpp.svg",
    extension: ".cpp",
  },
  {
    id: "5",
    label: "C# (Mono 6.8)",
    key: "csharp",
    monacoLanguage: "csharp",
    image: "/images/csharp.svg",
    extension: ".cs",
  },
  {
    id: "6",
    label: "JavaScript",
    key: "javascript",
    monacoLanguage: "javascript",
    image: "/images/javascript.svg",
    extension: ".js",
  },
];

const STARTER_CODE: Record<string, string> = {
  python: `# Python 3.11\nprint("Hello from Python!")\n`,
  java: `// Java 17\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}\n`,
  c: `// C (GCC 12)\n#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}\n`,
  cpp: `// C++ (G++ 12)\n#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}\n`,
  csharp: `// C# (Mono 6.8 / C# 6)\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello from C#!");\n    }\n}\n`,
  javascript: `// Node.js 20 LTS\nconsole.log("Hello from JavaScript!");\n`,
};

function OnlineIDE() {
  const { session, status } = useSessionData();
  const router = useRouter();
  const divRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [selectedTabId, setSelectedTabId] = useState("1");
  const [editorContent, setEditorContent] = useState<Record<string, string>>(STARTER_CODE);
  const [stdin, setStdin] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fetchedLanguages, setFetchedLanguages] = useState<Set<string>>(new Set());

  const currentTab = useMemo(
    () => TABS.find((t) => t.id === selectedTabId) || TABS[0],
    [selectedTabId]
  );

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const editorHeight = windowWidth >= 1024 ? "80vh" : "45vh";

  // Fetch saved code for the active language independently without overwriting other tabs
  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.username) return;

    const langKey = currentTab.key;
    if (fetchedLanguages.has(langKey)) return;

    let isMounted = true;
    axios
      .get(`/api/code/${langKey}`)
      .then((response) => {
        if (!isMounted) return;
        const savedCode = response.data?.code?.code;
        if (typeof savedCode === "string" && savedCode.trim().length > 0) {
          setEditorContent((prev) => ({
            ...prev,
            [langKey]: savedCode,
          }));
        }
        setFetchedLanguages((prev) => new Set(prev).add(langKey));
      })
      .catch((err) => {
        if (isMounted) {
          setFetchedLanguages((prev) => new Set(prev).add(langKey));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentTab.key, status, session?.user?.username, fetchedLanguages]);

  const handleRunCode = async () => {
    const code = editorContent[currentTab.key] || "";
    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/execute", {
        code,
        language: currentTab.key,
        inputs: stdin,
      });

      const data = response.data;
      if (response.status === 200 && data.exitCode === 0) {
        setTerminalHistory((prev) => [
          ...prev,
          `[Run: ${currentTab.label} in ${data.wallTimeMs}ms]`,
          data.stdout || "(No output)",
          "-----------------------------------",
        ]);
      } else {
        const errorMsg = data.error || data.stderr || "Execution failed";
        setTerminalHistory((prev) => [
          ...prev,
          `[Failed: ${currentTab.label} (Exit ${data.exitCode ?? 1}) in ${data.wallTimeMs ?? 0}ms]`,
          errorMsg,
          "-----------------------------------",
        ]);
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.error || error.message || "Execution error";
      setTerminalHistory((prev) => [
        ...prev,
        `[Error: ${currentTab.label}]`,
        errMsg,
        "-----------------------------------",
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCode = async () => {
    const code = editorContent[currentTab.key];
    if (!code) {
      toast({
        title: "Error",
        description: "No code to save",
        variant: "destructive",
      });
      return;
    }

    const result = await saveCode(currentTab.key, code);
    if (result.message) {
      toast({
        title: "Saved",
        description: `${currentTab.label} code saved successfully!`,
        variant: "default",
      });
    } else {
      toast({
        title: "Failed to save code",
        description: result.error || "Could not save code",
        variant: "destructive",
      });
    }
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  const handleFullScreen = () => {
    if (divRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        divRef.current.requestFullscreen();
      }
    }
  };

  if (status === "loading") {
    return <div className="p-8 text-center text-white">Loading Online IDE...</div>;
  }

  if (status === "unauthenticated") {
    router.replace("/sign-in");
    return <div className="p-8 text-center text-white">Please log in to access this feature</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 lg:p-4 w-full">
      <div
        className="flex flex-col w-full border-black bg-[#121212] rounded-md shadow-md pb-4"
        ref={divRef}
      >
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between lg:items-center sm:px-4 py-2 border-b border-gray-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Language Tabs */}
            <div className="flex flex-wrap space-x-2 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTabId(tab.id)}
                  title={tab.label}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    selectedTabId === tab.id
                      ? "bg-gray-200 text-black shadow"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <Image
                    src={tab.image}
                    alt={tab.label}
                    width={20}
                    height={20}
                    className="inline-block"
                  />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Run Button */}
            <Button
              onClick={handleRunCode}
              disabled={isSubmitting}
              className="flex items-center bg-emerald-600 text-white font-bold hover:bg-emerald-500 rounded-lg px-4 py-2 ml-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Run</span>
                  <Image
                    src="/images/settings.svg"
                    alt="run"
                    width={18}
                    height={18}
                  />
                </div>
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-2 px-2 mt-2 sm:mt-0">
            <Button
              onClick={handleSubmitCode}
              variant="outline"
              className="flex items-center gap-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700 rounded-lg"
            >
              <Image src="/images/save.svg" alt="save" width={16} height={16} />
              Save Code
            </Button>

            <Button
              onClick={handleFullScreen}
              variant="outline"
              className="flex items-center bg-gray-800 text-white border-gray-700 hover:bg-gray-700 rounded-lg"
              title="Full Screen"
            >
              <Image src="/images/full-screen.svg" alt="full screen" width={16} height={16} />
            </Button>
          </div>
        </div>

        {/* Editor & Output Panels */}
        <div className="flex flex-col lg:flex-row gap-4 p-4">
          {/* Monaco Editor Panel */}
          <div className="w-full lg:w-[60%] flex flex-col shadow-md rounded-lg overflow-hidden border border-gray-800">
            <div className="flex items-center justify-between text-gray-300 bg-[#1e1e1e] py-2 px-4 border-b border-gray-800 text-sm">
              <span>main{currentTab.extension} ({currentTab.label})</span>
            </div>
            <Editor
              height={editorHeight}
              language={currentTab.monacoLanguage}
              value={editorContent[currentTab.key] ?? STARTER_CODE[currentTab.key]}
              onChange={(value) =>
                setEditorContent((prev) => ({
                  ...prev,
                  [currentTab.key]: value || "",
                }))
              }
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                wordWrap: "on",
                fontSize: 14,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Terminal & Stdin Panel */}
          <div className="w-full lg:w-[40%] flex flex-col space-y-4">
            {/* Standard Input Box */}
            <div className="flex flex-col border border-gray-800 rounded-lg overflow-hidden bg-[#1e1e1e]">
              <div className="text-gray-300 text-sm px-4 py-2 border-b border-gray-800 font-medium">
                Standard Input (stdin)
              </div>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter standard input for program (sent before execution)..."
                rows={3}
                className="w-full p-3 bg-gray-900 text-gray-200 text-sm font-mono focus:outline-none resize-y"
              />
            </div>

            {/* Output Terminal */}
            <div className="flex-1 flex flex-col border border-gray-800 rounded-lg overflow-hidden bg-[#1e1e1e]">
              <div className="flex justify-between items-center text-gray-300 py-2 px-4 border-b border-gray-800 text-sm font-medium">
                <span>Output Console</span>
                <button
                  onClick={clearTerminal}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded"
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 p-4 bg-gray-950 text-gray-200 font-mono text-sm overflow-auto max-h-[50vh] min-h-[30vh]">
                {terminalHistory.length === 0 ? (
                  <span className="text-gray-500 italic">No output yet. Click &quot;Run&quot; to execute.</span>
                ) : (
                  terminalHistory.map((line, index) => (
                    <pre key={index} className="whitespace-pre-wrap leading-relaxed">
                      {line}
                    </pre>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnlineIDE;
