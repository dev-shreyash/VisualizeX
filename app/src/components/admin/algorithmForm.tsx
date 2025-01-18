"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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

interface AlgorithmFormProps {
  algorithm: Algorithm;
  onSave: (updatedAlgorithm: Algorithm) => Promise<void>; // Support async onSave
  onCancel: () => void;
}

const AlgorithmForm: React.FC<AlgorithmFormProps> = ({ algorithm, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Algorithm>(algorithm);

  useEffect(() => {
    // Ensure predefined languages exist in the codes array
    const predefinedLanguages = [
      "Python",
      "Java",
      "C",
      "C++",
      "C#",
      "JavaScript",
    ];

    const updatedCodes = predefinedLanguages.map((language) => {
      const existingCode = formData.codes.find((code) => code.language === language);
      return existingCode || { language, code: "" };
    });

    setFormData({ ...formData, codes: updatedCodes });
  }, [algorithm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Algorithm,
    index: number
  ) => {
    const updatedArray = [...(formData[field] as string[])];
    updatedArray[index] = e.target.value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleCodesChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const updatedCodes = [...formData.codes];
    updatedCodes[index].code = e.target.value;
    setFormData({ ...formData, codes: updatedCodes });
  };

  const handleAddArrayField = (field: keyof Algorithm) => {
    const updatedArray = [...(formData[field] as string[]), ""];
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSave = async () => {
    await onSave(formData); // Call the parent component's save handler
  };

  return (
    <form className="space-y-6">
      {/* Key Field */}
      <div>
        <label className="block font-semibold mb-1">Key</label>
        <input
          type="text"
          name="key"
          value={formData.key}
          onChange={handleChange}
          placeholder="e.g., bubbleSort"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
  
      {/* Name Field */}
      <div>
        <label className="block font-semibold mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Bubble Sort"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
  
      {/* Description Field */}
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Bubble Sort is a simple comparison-based sorting algorithm..."
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
  
      {/* Steps Field */}
      <div>
        <label className="block font-semibold mb-1">Steps</label>
        {formData.steps.map((step, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={step}
              onChange={(e) => handleArrayChange(e, "steps", index)}
              placeholder={`Step ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => handleAddArrayField("steps")}
          className="mt-2 bg-blue-500 text-white"
        >
          Add Step
        </Button>
      </div>
  
      {/* Key Concepts Field */}
      <div>
        <label className="block font-semibold mb-1">Key Concepts</label>
        {formData.keyConcepts.map((concept, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={concept}
              onChange={(e) => handleArrayChange(e, "keyConcepts", index)}
              placeholder={`Key Concept ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => handleAddArrayField("keyConcepts")}
          className="mt-2 bg-blue-500 text-white"
        >
          Add Key Concept
        </Button>
      </div>
  
      {/* Worst/Best/Average Cases */}
      {["worstCase", "bestCase", "averageCase"].map((field) => (
        <div key={field}>
          <label className="block font-semibold mb-1">{field.replace(/([A-Z])/g, " $1")}</label>
          <input
            type="text"
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            placeholder={`e.g., ${
              field === "worstCase" ? "O(n^2)" : field === "bestCase" ? "O(n)" : "O(n^2)"
            }`}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      ))}
  
      {/* Space Complexity Field */}
      <div>
        <label className="block font-semibold mb-1">Space Complexity</label>
        <input
          type="text"
          name="spaceComplexity"
          value={formData.spaceComplexity}
          onChange={handleChange}
          placeholder="e.g., O(1)"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
  
      {/* Advantages Field */}
      <div>
        <label className="block font-semibold mb-1">Advantages</label>
        {formData.advantages.map((adv, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={adv}
              onChange={(e) => handleArrayChange(e, "advantages", index)}
              placeholder={`Advantage ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => handleAddArrayField("advantages")}
          className="mt-2 bg-blue-500 text-white"
        >
          Add Advantage
        </Button>
      </div>
  
      {/* Disadvantages Field */}
      <div>
        <label className="block font-semibold mb-1">Disadvantages</label>
        {formData.disadvantages.map((disadv, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={disadv}
              onChange={(e) => handleArrayChange(e, "disadvantages", index)}
              placeholder={`Disadvantage ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => handleAddArrayField("disadvantages")}
          className="mt-2 bg-blue-500 text-white"
        >
          Add Disadvantage
        </Button>
      </div>
  
      {/* Practical Use Field */}
      <div>
        <label className="block font-semibold mb-1">Practical Use</label>
        {formData.practicalUse.map((use, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              value={use}
              onChange={(e) => handleArrayChange(e, "practicalUse", index)}
              placeholder={`Use ${index + 1}`}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
        <Button
          type="button"
          onClick={() => handleAddArrayField("practicalUse")}
          className="mt-2 bg-blue-500 text-white"
        >
          Add Practical Use
        </Button>
      </div>
  
      {/* Code Implementations */}
      <div>
        <label className="block font-semibold mb-1">Code Implementations</label>
        {formData.codes.map((code, index) => (
          <div key={index} className="mb-4">
            <label className="block font-semibold">{code.language}</label>
            <textarea
              value={code.code}
              onChange={(e) => handleCodesChange(e, index)}
              placeholder={`Enter ${code.language} code`}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={6}
            />
          </div>
        ))}
      </div>
  
      {/* Metadata Fields */}
      {["metadataName", "metadataDescription", "metadataImage", "metadataRoute"].map((field) => (
        <div key={field}>
          <label className="block font-semibold mb-1">{field.replace(/metadata/, "")}</label>
          <input
            type="text"
            name={field}
            value={(formData as any)[field]}
            onChange={handleChange}
            placeholder={`Enter ${field.replace(/metadata/, "").toLowerCase()}`}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      ))}
  
      {/* Save and Cancel Buttons */}
      <div className="flex space-x-4">
        <Button onClick={handleSave} className="bg-green-500 text-white">
          Save
        </Button>
        <Button onClick={onCancel} className="bg-gray-500 text-white">
          Cancel
        </Button>
      </div>
    </form>
  );
  
};

export default AlgorithmForm;
