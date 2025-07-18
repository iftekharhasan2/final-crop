import React, { useEffect, useState } from "react";
import axios from "axios";

const InstructionViewer = ({ userId, phase, day }) => {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [uploadedImages, setUploadedImages] = useState({}); // base64 images for activities
  const [uploadedExtraImages, setUploadedExtraImages] = useState({}); // base64 images for extra work

  const [localDoneIndices, setLocalDoneIndices] = useState(new Set()); // done activities locally
  const [localDoneExtraIndices, setLocalDoneExtraIndices] = useState(new Set()); // done extra work locally

  const fetchData = () => {
    setLoading(true);
    setError(null);

    axios
      .post("https://crop-backend-app.onrender.com/api/instructions", {
        user_id: userId,
        phase,
        day,
      })
      .then((res) => {
        setDayData(res.data);
        setLoading(false);
        // Reset local done & uploads on new data load
        setLocalDoneIndices(new Set());
        setLocalDoneExtraIndices(new Set());
        setUploadedImages({});
        setUploadedExtraImages({});
      })
      .catch(() => {
        setError("Failed to fetch instructions");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();

    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [userId, phase, day]);

  // Handle image upload for main activities
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;

      setUploadedImages((prev) => ({
        ...prev,
        [index]: base64Image,
      }));

      // Mark activity done locally
      setLocalDoneIndices((prev) => new Set(prev).add(index));

      // Also mark extra work done locally for the same index (if any)
      setLocalDoneExtraIndices((prev) => new Set(prev).add(index));
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload for extra work
  const handleExtraWorkImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result;

      setUploadedExtraImages((prev) => ({
        ...prev,
        [index]: base64Image,
      }));

      // Mark extra work done locally
      setLocalDoneExtraIndices((prev) => new Set(prev).add(index));
    };
    reader.readAsDataURL(file);
  };

  const handleMoveToExtra = (index) => {
    axios
      .post("https://crop-backend-app.onrender.com/api/move_to_extra_work", {
        user_id: userId,
        day: dayData.day,
        index,
      })
      .then(fetchData)
      .catch(() => alert("Failed to move to extra work"));
  };

  if (loading) return <p>Loading instructions...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!dayData) return <p>No data found.</p>;

  const activities = dayData.activities || [];
  const extraWork = dayData.extra_work || [];

  // Combine backend done + local done for activities
  const combinedDone = activities.map(
    (act, idx) => act.done || localDoneIndices.has(idx)
  );

  // Filter active activities (not done)
  const activeActivities = activities.filter(
    (act, idx) => !combinedDone[idx]
  );

  // Filter active extra work (not done locally)
  const activeExtraWork = extraWork.filter(
    (_, idx) => !localDoneExtraIndices.has(idx)
  );

  const totalActivities = activities.length;
  const doneCount = combinedDone.filter(Boolean).length;
  const progressPercent =
    totalActivities === 0 ? 0 : (doneCount / totalActivities) * 100;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 1200,
        margin: "auto",
        padding: 20,
        background: "#f9f9f9",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#2c3e50" }}>
        {dayData.day}
      </h2>

      {/* Progress Bar */}
      <div
        style={{
          background: "#ddd",
          borderRadius: 10,
          height: 24,
          width: "100%",
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            background: "#4caf50",
            height: "100%",
            borderRadius: 10,
            transition: "width 0.4s ease-in-out",
          }}
        />
      </div>

      <p
        style={{
          textAlign: "center",
          marginBottom: 30,
          fontWeight: "600",
          color: "#34495e",
        }}
      >
        Progress: {doneCount} / {totalActivities} activities completed
      </p>

      {/* Today's Activities */}
      <section>
        <h3 style={{ color: "#2980b9", marginBottom: 15 }}>Today's Activities</h3>
        {activeActivities.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#7f8c8d" }}>
            All activities completed!
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {activeActivities.map((act) => {
              const realIndex = activities.findIndex((a) => a === act);
              return (
                <li
                  key={realIndex}
                  style={{
                    background: "white",
                    padding: 15,
                    marginBottom: 12,
                    borderRadius: 8,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span>
                    <strong>{act.period}</strong> ({act.time_range}): {act.description}
                  </span>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <label
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        backgroundColor: "#27ae60",
                        color: "#fff",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      📷 Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, realIndex)}
                        style={{ display: "none" }}
                      />
                    </label>

                    {/* Show image preview if uploaded */}
                    {uploadedImages[realIndex] && (
                      <img
                        src={uploadedImages[realIndex]}
                        alt="Uploaded"
                        style={{
                          maxWidth: 150,
                          maxHeight: 100,
                          marginTop: 8,
                          borderRadius: 6,
                          border: "1px solid #ccc",
                        }}
                      />
                    )}

                    <button
                      onClick={() => handleMoveToExtra(realIndex)}
                      style={{
                        backgroundColor: "#3498db",
                        border: "none",
                        color: "white",
                        padding: "8px 14px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "600",
                        marginLeft: "auto",
                      }}
                    >
                      ➡ Next day Work
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Extra Work */}
      <section style={{ marginTop: 40 }}>
        <h3 style={{ color: "#2980b9", marginBottom: 15 }}>Extra Work</h3>
        {activeExtraWork.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#7f8c8d" }}>No extra work for today.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {activeExtraWork.map((act, idx) => {
              const originalIndex = extraWork.findIndex((a) => a === act);
              return (
                <li
                  key={originalIndex}
                  style={{
                    background: "white",
                    padding: 15,
                    marginBottom: 12,
                    borderRadius: 8,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span>
                    <strong>{act.period}</strong> ({act.time_range}): {act.description}
                  </span>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <label
                      style={{
                        display: "inline-block",
                        padding: "8px 12px",
                        backgroundColor: "#27ae60",
                        color: "#fff",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      📷 Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleExtraWorkImageUpload(e, originalIndex)}
                        style={{ display: "none" }}
                      />
                    </label>

                    {uploadedExtraImages[originalIndex] && (
                      <img
                        src={uploadedExtraImages[originalIndex]}
                        alt="Uploaded Extra Work"
                        style={{
                          maxWidth: 150,
                          maxHeight: 100,
                          marginTop: 8,
                          borderRadius: 6,
                          border: "1px solid #ccc",
                        }}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

export default InstructionViewer;
