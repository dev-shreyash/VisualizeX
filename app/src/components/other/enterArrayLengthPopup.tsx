"use client";

import React, { useState } from "react";

interface ArrayLengthPopupProps {
  onClose: () => void; // Function to close the popup
  onSubmit: (length: number) => void; // Function to handle submitted length
}

const ArrayLengthPopup: React.FC<ArrayLengthPopupProps> = ({ onClose, onSubmit }) => {
  const [lengthInput, setLengthInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setLengthInput(value);

    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 250) {
      setError("Please enter a valid number between 0 and 250.");
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    const numericValue = parseInt(lengthInput, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 250) {
      onSubmit(numericValue);
      onClose();
    } else {
      setError("Please enter a valid number between 0 and 250.");
    }
  };

  return (
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-lg font-semibold mb-4 text-center">Enter Array Length</h2>
        <input
          type="number"
          min="0"
          max="250"
          value={lengthInput}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
          placeholder="0 - 250"
        />
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArrayLengthPopup;
