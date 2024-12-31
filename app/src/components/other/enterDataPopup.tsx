import React, { useState, useRef } from "react";

interface EnterDataPopupProps {
  onClose: () => void; // Function to close the popup
  onSubmit: (data: number[]) => void; // Function to handle submitted data
}

const EnterDataPopup: React.FC<EnterDataPopupProps> = ({ onClose, onSubmit }) => {
  const [data, setData] = useState<string[]>(Array(15).fill("")); // Array of 15 empty strings
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value.length <= 2) { // Allow only numeric input
      const newData = [...data];
      newData[index] = value;
      setData(newData);

      // Automatically focus the next input if not the last, with 1-second delay
      if (value && index < 14) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 1000); // 1 second delay
      }
    }
  };

  const handleSubmit = () => {
    const filteredData = data.filter((num) => num.trim() !== "");
    if (filteredData.length >= 2) {
      onSubmit(filteredData.map(Number)); // Pass numeric array to parent
      onClose();
    } else {
      alert("Please enter at least 2 numbers.");
    }
  };

  return (
    <div className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[900px]">
        <h2 className="text-lg font-semibold mb-4">Enter Data</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {data.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={2}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="flex-1 min-w-[40px] max-w-[50px] border border-gray-300 rounded p-2 text-center"
            />
          ))}
        </div>
        <div className="flex justify-end space-x-2">
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

export default EnterDataPopup;
