"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const InstructionList = ({ userId }) => {
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    axios
      .get(`https://crop-backend-api-urs6.onrender.com/instructions/${userId}`)
      .then((res) => setInstructions(res.data))
      .catch((err) => console.error("Error fetching instructions:", err));
  }, [userId]);

  const handleDone = async (day, index) => {
    try {
      await axios.patch(`https://crop-backend-api-urs6.onrender.com/instructions/${userId}/${day}`, {
        action: "done",
        index,
      });
      const res = await axios.get(`https://crop-backend-api-urs6.onrender.com/instructions/${userId}`);
      setInstructions(res.data);
    } catch (err) {
      console.error("Error marking done:", err);
    }
  };

  const handleMoveToNextDay = async (day, index, activity, nextDay) => {
    try {
      await axios.patch(`https://crop-backend-api-urs6.onrender.com/instructions/${userId}/${day}`, {
        action: "move_to_next_day_extra",
        index,
        activity,
        next_day: nextDay,
      });
      const res = await axios.get(`https://crop-backend-api-urs6.onrender.com/instructions/${userId}`);
      setInstructions(res.data);
    } catch (err) {
      console.error("Error moving to next day:", err);
    }
  };

  const handleExtraWorkDone = async (dayDoc, index) => {
    try {
      const updated = [...dayDoc.extra_work];
      updated.splice(index, 1);

      await axios.patch(
        `https://crop-backend-api-urs6.onrender.com/instructions/${userId}/${dayDoc.day}`,
        { action: "done", index: -1 }
      );

      await axios.put(
        `https://crop-backend-api-urs6.onrender.com/instructions/${userId}/${dayDoc.day}/extra`,
        { extra_work: updated }
      );

      const res = await axios.get(`https://crop-backend-api-urs6.onrender.com/instructions/${userId}`);
      setInstructions(res.data);
    } catch (err) {
      console.error("Error updating extra work:", err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {instructions.map((dayDoc, i) => {
        const nextDay = instructions[i + 1]?.day;

        return (
          <div key={dayDoc.day} className="border rounded-xl p-4 shadow bg-white">
            <h2 className="text-xl font-bold text-green-700 mb-3">{dayDoc.day}</h2>

            {/* Activities */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">✅ Activities</h3>
              {dayDoc.activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    checked={activity.done}
                    onChange={() => handleDone(dayDoc.day, index)}
                  />
                  <span className={activity.done ? "line-through text-gray-500" : ""}>
                    {activity.description} ({activity.period}, {activity.time_range})
                  </span>
                  {nextDay && !activity.done && (
                    <button
                      onClick={() =>
                        handleMoveToNextDay(dayDoc.day, index, activity, nextDay)
                      }
                      className="ml-2 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Move to {nextDay}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Extra Work */}
            {dayDoc.extra_work.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-orange-700 mb-1">🟠 Extra Work</h3>
                {dayDoc.extra_work.map((work, index) => (
                  <div key={index} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      onChange={() => handleExtraWorkDone(dayDoc, index)}
                    />
                    <span>
                      {work.description} ({work.period}, {work.time_range})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default InstructionList;
