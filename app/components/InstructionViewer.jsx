import React, { useEffect, useState } from "react";
import axios from "axios";

const InstructionViewer = ({ userId, phase, day }) => {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    axios
      .post("http://localhost:5000/api/instructions", { user_id: userId, phase, day })
      .then((res) => {
        setDayData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch instructions");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [userId, phase, day]);

  // Mark an activity done (in activities list)
  const handleDoneToggle = (index) => {
    axios
      .post("http://localhost:5000/api/update_done", {
        user_id: userId,
        day: dayData.day,
        index,
        done: true,
      })
      .then(() => fetchData())
      .catch(() => alert("Failed to update status"));
  };

  // Move an activity to extra work of next day
  const handleMoveToExtra = (index) => {
    axios
      .post("http://localhost:5000/api/move_to_extra_work", {
        user_id: userId,
        day: dayData.day,
        index,
      })
      .then(() => fetchData())
      .catch(() => alert("Failed to move to extra work"));
  };

  // Mark an extra work done and remove it
  const handleCompleteExtra = (index) => {
    axios
      .post("http://localhost:5000/api/complete_and_remove_extra", {
        user_id: userId,
        day: dayData.day,
        index,
      })
      .then(() => fetchData())
      .catch(() => alert("Failed to complete extra work"));
  };

  if (loading) return <p>Loading instructions...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!dayData) return <p>No data found.</p>;

  const activeActivities = dayData.activities.filter((act) => !act.done);

  const totalActivities = dayData.activities.length;
  const doneCount = dayData.activities.filter((act) => act.done).length;
  const progressPercent = totalActivities === 0 ? 0 : (doneCount / totalActivities) * 100;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: 700,
        margin: "auto",
        padding: 20,
        background: "#f9f9f9",
        borderRadius: 8,
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#2c3e50" }}>{dayData.day}</h2>

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
      <p style={{ textAlign: "center", marginBottom: 30, fontWeight: "600", color: "#34495e" }}>
        Progress: {doneCount} / {totalActivities} activities completed
      </p>

      <section>
        <h3 style={{ color: "#2980b9", marginBottom: 15 }}>Today's Activities</h3>
        {activeActivities.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#7f8c8d" }}>All activities completed!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {activeActivities.map((act, idx) => {
              const realIndex = dayData.activities.findIndex((a) => a === act);
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
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <strong>{act.period}</strong> ({act.time_range}): {act.description}
                  </span>

                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <button
                      onClick={() => handleDoneToggle(realIndex)}
                      style={{
                        backgroundColor: "#27ae60",
                        border: "none",
                        color: "white",
                        padding: "8px 14px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "background-color 0.2s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e8449")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#27ae60")}
                      title="Mark this activity as done"
                    >
                      ✔ Done
                    </button>

                    <button
                      onClick={() => handleMoveToExtra(realIndex)}
                      style={{
                        backgroundColor: "#3498db",
                        border: "none",
                        color: "white",
                        padding: "6px 14px",
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        fontWeight: "600",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#2980b9")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#3498db")}
                      title="Move this activity to extra work of next day"
                    >
                      ➡ Extra Work
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 40 }}>
        <h3 style={{ color: "#2980b9", marginBottom: 15 }}>Extra Work</h3>
        {dayData.extra_work.length === 0 ? (
          <p style={{ fontStyle: "italic", color: "#7f8c8d" }}>No extra work for today.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {dayData.extra_work.map((act, idx) => (
              <li
                key={idx}
                style={{
                  background: "white",
                  padding: 15,
                  marginBottom: 12,
                  borderRadius: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  <strong>{act.period}</strong> ({act.time_range}): {act.description}
                </span>
                <button
                  onClick={() => handleCompleteExtra(idx)}
                  style={{
                    backgroundColor: "#27ae60",
                    border: "none",
                    color: "white",
                    padding: "8px 14px",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e8449")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#27ae60")}
                  title="Mark extra work done and remove"
                >
                  ✔ Done
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default InstructionViewer;
