import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Database = () => {
  const [instructions, setInstructions] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = () => {
    axios
      .get("http://localhost:5005/api/instructions")
      .then((res) => setInstructions(res.data))
      .catch((err) => console.error("Error fetching instructions:", err));
  };

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      axios
        .delete(`http://localhost:5005/api/instructions/${id}`)
        .then(() => fetchInstructions())
        .catch((err) => console.error("Error deleting:", err));
    }
  };

  const handleEdit = (id) => {
    const newEmail = prompt("Enter new userId (email):");
    if (newEmail) {
      axios
        .put(`http://localhost:5005/api/instructions/${id}`, { userId: newEmail })
        .then(() => fetchInstructions())
        .catch((err) => console.error("Error editing:", err));
    }
  };

  const handleRedirectToFinal = () => {
    router.push("/final");
  };

  const filtered = instructions.filter((item) =>
    item.userId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      {/* Redirect button on top */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleRedirectToFinal}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition"
        >
          Create new project
        </button>
      </div>

      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
        Daywise Instruction Database
      </h2>

      <input
        type="text"
        placeholder="🔍 Search by userId..."
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <ul className="space-y-4">
        {filtered.map((item, index) => (
          <li
            key={item._id}
            className={`p-4 rounded-lg shadow transition-transform transform hover:scale-[1.01] 
            ${openIndex === index ? "bg-blue-50" : "bg-gray-100"} cursor-pointer`}
            onClick={() => toggleDropdown(index)}
          >
            <div className="flex justify-between items-center">
              <div className="text-gray-800 font-medium">
                <span className="mr-2 text-gray-500">{index + 1}.</span>
                <span>{item.userId}</span>
                <span className="ml-2 text-sm text-blue-600">({item.docs?.length || 0} docs)</span>
              </div>
              <div className="text-xl text-gray-600">
                {openIndex === index ? "▲" : "▼"}
              </div>
            </div>

            {openIndex === index && (
              <div className="mt-4 text-sm text-gray-700 space-y-2 pl-2">
                <p><span className="font-semibold">Mongo ID:</span> {item._id}</p>
                <p><span className="font-semibold">User Email:</span> {item.userId}</p>
                <p><span className="font-semibold">Docs Count:</span> {item.docs?.length || 0}</p>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item._id);
                    }}
                    className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded shadow-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Database;
