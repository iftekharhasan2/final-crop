import React, { useState } from "react";

const costDataMap = {
  fertilizer: {
    title: "Fertilizer Cost",
    data: [
      { Item: "Urea", "Amount Required (kg)/(g)/piece": "30", "Unit Cost": 27, Total: 810 },
      { Item: "DAP", "Amount Required (kg)/(g)/piece": "45", "Unit Cost": 21, Total: 945 },
      { Item: "TSP", "Amount Required (kg)/(g)/piece": "35", "Unit Cost": 27, Total: 945 },
      { Item: "MoP", "Amount Required (kg)/(g)/piece": "55", "Unit Cost": 20, Total: 1100 },
      { Item: "Gypsum", "Amount Required (kg)/(g)/piece": "10", "Unit Cost": 280, Total: 2800 },
      { Item: "Zinc", "Amount Required (kg)/(g)/piece": "2", "Unit Cost": 310, Total: 620 },
      { Item: "Boron", "Amount Required (kg)/(g)/piece": "2", "Unit Cost": 490, Total: 980 },
      { Item: "Vermi-compost", "Amount Required (kg)/(g)/piece": "100", "Unit Cost": 12, Total: 1200 },
      { Item: "Total Fertilizer Cost", "Amount Required (kg)/(g)/piece": "", "Unit Cost": "", Total: 9400 },
    ],
  },

  insectice: {
    title: "Insecticide Cost",
    data: [
      { Item: "Proclaim (10g/packet)", Quantity: "10", "Unit Cost": 85, Total: 850 },
      { Item: "Movento (50ml/packet)", Quantity: "4", "Unit Cost": 250, Total: 1000 },
      { Item: "Confidor (2gm/packet)", Quantity: "20", "Unit Cost": 25, Total: 500 },
      { Item: "Alika (50ml/packet)", Quantity: "2", "Unit Cost": 240, Total: 480 },
      { Item: "Ripcord (50ml/Packet)", Quantity: "2", "Unit Cost": 82, Total: 164 },
      { Item: "Tundra (10gm/packet)", Quantity: "6", "Unit Cost": 45, Total: 270 },
      { Item: "Total insectice cost", Quantity: " ", "Unit Cost": 0, Total: 2830 },
    ],
  },

  // Add other cost categories similarly
};

export default function CostDashboard() {
  const [selectedCost, setSelectedCost] = useState(null);

  const handleBack = () => setSelectedCost(null);

  if (selectedCost) {
    const { title, data } = costDataMap[selectedCost];

    return (
      <div className="max-w-5xl mx-auto mt-12 px-6 sm:px-4">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-2 border-gray-300 pb-2">
          {title}
        </h2>

        <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {data.length > 0 &&
                  Object.keys(data[0]).map((col) => (
                    <th
                      key={col}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {Object.values(row).map((val, idx2) => (
                    <td key={idx2} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleBack}
          type="button"
          className="mt-8 px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6 sm:px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-12 text-center">
        Cucumber Cost Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Object.entries(costDataMap).map(([key, { title }]) => (
          <button
            key={key}
            onClick={() => setSelectedCost(key)}
            type="button"
            className="py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            {title.replace(" Cost", "")}
          </button>
        ))}
      </div>
    </div>
  );
}
