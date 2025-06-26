import { useState } from "react";
import axios from "axios";

const UserForm = () => {
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("userId", userId);

      const response = await axios.post("http://localhost:5004/submit", formData);
      setMessage(response.data);
    } catch (err) {
      setMessage("❌ Failed to submit schedule.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Insert Schedule for User</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={{ display: "block", margin: "10px 0", padding: "8px", width: "100%" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Submit Schedule</button>
      </form>
      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
};

export default UserForm;
