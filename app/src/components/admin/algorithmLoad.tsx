"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AlgorithmForm from "./algorithmForm";

interface Algorithm {
  key: string;
  name: string;
  description: string;
  steps: string[];
  keyConcepts: string[];
  worstCase: string;
  bestCase: string;
  averageCase: string;
  spaceComplexity: string;
  advantages: string[];
  disadvantages: string[];
  practicalUse: string[];
  codes: { language: string; code: string }[];
  metadataName: string;
  metadataDescription: string;
  metadataImage: string;
  metadataRoute: string;
}

export default function AlgorithmManagement() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [filteredAlgorithms, setFilteredAlgorithms] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingAlgorithm, setEditingAlgorithm] = useState<Algorithm | null>(null);
  const [creatingAlgorithm, setCreatingAlgorithm] = useState(false);

  // Fetch algorithms from the server
  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        const response = await axios.get("/api/algorithms");
        setAlgorithms(response.data.data);
        setFilteredAlgorithms(response.data.data);
      } catch (error) {
        console.error("Error fetching algorithms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithms();
  }, []);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = algorithms.filter(
      (algo) =>
        algo.name.toLowerCase().includes(query) || algo.key.toLowerCase().includes(query)
    );
    setFilteredAlgorithms(filtered);
  };

  // Handle edit
  const handleEdit = (algorithm: Algorithm) => {
    setEditingAlgorithm(algorithm);
  };

  // Handle save for updated algorithm
  const handleSave = async (updatedAlgorithm: Algorithm): Promise<void> => {
    try {
      const response = await axios.put("/api/algorithm", updatedAlgorithm);
      alert("Algorithm updated successfully!");

      setAlgorithms((prev) =>
        prev.map((algo) =>
          algo.key === updatedAlgorithm.key ? updatedAlgorithm : algo
        )
      );
      setFilteredAlgorithms((prev) =>
        prev.map((algo) =>
          algo.key === updatedAlgorithm.key ? updatedAlgorithm : algo
        )
      );

      setEditingAlgorithm(null);
      setCreatingAlgorithm(false);
    } catch (error) {
      console.error("Error updating algorithm:", error);
      alert("Failed to update algorithm.");
    }
  };

  // Handle save for new algorithm
  const handleCreate = async (newAlgorithm: Algorithm): Promise<void> => {
    try {
      const response = await axios.post("/api/algorithm", newAlgorithm);
      alert("Algorithm created successfully!");

      setAlgorithms((prev) => [response.data.data, ...prev]);
      setFilteredAlgorithms((prev) => [response.data.data, ...prev]);

      setCreatingAlgorithm(false);
    } catch (error) {
      console.error("Error creating algorithm:", error);
      alert("Failed to create algorithm.");
    }
  };

  // Handle cancel edit or create
  const handleCancelEdit = () => {
    setEditingAlgorithm(null);
    setCreatingAlgorithm(false);
  };

  // Handle delete
  const handleDelete = async (key: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this algorithm?")) {
      try {
        await axios.delete(`/api/algorithm?key=${key}`);
        alert("Algorithm deleted successfully!");

        setAlgorithms((prev) => prev.filter((algo) => algo.key !== key));
        setFilteredAlgorithms((prev) => prev.filter((algo) => algo.key !== key));
      } catch (error) {
        console.error("Error deleting algorithm:", error);
        alert("Failed to delete algorithm.");
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 text-center">
        <Loader2 className="animate-spin w-10 h-10 mx-auto" />
        <p>Loading algorithms...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Algorithm Management</h2>

      {/* Add New Algorithm Button */}
      <div className="mb-6">
        <Button onClick={() => setCreatingAlgorithm(true)} className="bg-blue-500 text-white">
          Add New Algorithm
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or key"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* Conditionally render the form or table */}
      {creatingAlgorithm ? (
        <AlgorithmForm
          algorithm={{
            key: "",
            name: "",
            description: "",
            steps: [],
            keyConcepts: [],
            worstCase: "",
            bestCase: "",
            averageCase: "",
            spaceComplexity: "",
            advantages: [],
            disadvantages: [],
            practicalUse: [],
            codes: [
              { language: "python", code: "" },
              { language: "java", code: "" },
              { language: "c", code: "" },
              { language: "cpp", code: "" },
              { language: "csharp", code: "" },
              { language: "javascript", code: "" },
            ],
            metadataName: "",
            metadataDescription: "",
            metadataImage: "",
            metadataRoute: "",
          }}
          onSave={handleCreate}
          onCancel={handleCancelEdit}
        />
      ) : editingAlgorithm ? (
        <AlgorithmForm
          algorithm={editingAlgorithm}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Key</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlgorithms.length > 0 ? (
              filteredAlgorithms.map((algo) => (
                <tr key={algo.key}>
                  <td className="border border-gray-300 px-4 py-2">{algo.key}</td>
                  <td className="border border-gray-300 px-4 py-2">{algo.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{algo.metadataDescription}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Button onClick={() => handleEdit(algo)} className="mr-2">
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(algo.key)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No algorithms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
