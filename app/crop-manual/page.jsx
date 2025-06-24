"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken"; // make sure you have this installed
import AgricultureAssistant from "../components/AgricultureAssistant";

const Manual = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      setUserId(decoded.id);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <AgricultureAssistant />
    </div>
  );
};

export default Manual;
