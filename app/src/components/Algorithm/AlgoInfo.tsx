import { useEffect, useState } from "react";

interface AlgorithmProps {
  key: string;
  name: string;
  description: string;
  image: string;
  route: string;
}

interface AlgorithmData {
  key: string;
  algorithm: string;
  description: string;
  steps: string[];
  keyConcepts: string[];
  complexity: {
    time: {
      worstCase: string;
      bestCase: string;
      averageCase: string;
    };
    space: string;
  };
  advantages: string[];
  disadvantages: string[];
  practicalUse: string[];
}

export default function AlgoInfo({ algorithm }: { algorithm: AlgorithmProps }) {
  const [data, setData] = useState<AlgorithmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlgoData() {
      try {
        const response = await fetch(`/data/algorithmInfo.json`);
        if (!response.ok) {
          throw new Error("Failed to fetch algorithm data");
        }
        const result: AlgorithmData[] = await response.json();

        const selectedAlgo = result.find(
          (item: AlgorithmData) => item.key === algorithm.key
        );

        if (selectedAlgo) {
          setData(selectedAlgo);
        } else {
          throw new Error("Algorithm not found");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchAlgoData();
  }, [algorithm.key]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600">Error: {error}</p>;
  if (!data)
    return <p className="text-center text-gray-600">No data found.</p>;

  return (
    <div className="max-w-4xl mx-auto  p-6 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-600 mb-4">
        {data.algorithm}
      </h1>
      <p className="text-gray-700 text-lg mb-6">{data.description}</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Steps</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          {data.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Key Concepts
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {data.keyConcepts.map((concept, index) => (
            <li key={index}>{concept}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Complexity
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Worst Case:</strong> {data.complexity.time.worstCase}
          </li>
          <li>
            <strong>Best Case:</strong> {data.complexity.time.bestCase}
          </li>
          <li>
            <strong>Average Case:</strong> {data.complexity.time.averageCase}
          </li>
          <li>
            <strong>Space Complexity:</strong> {data.complexity.space}
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Advantages
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {data.advantages.map((advantage, index) => (
            <li key={index}>{advantage}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Disadvantages
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {data.disadvantages.map((disadvantage, index) => (
            <li key={index}>{disadvantage}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Practical Uses
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {data.practicalUse.map((use, index) => (
            <li key={index}>{use}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
