"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";

import PredictForm from "../components/PredictForm";

export default function CropPredictionPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      jwt.decode(token);
      // you can extract id if you want, e.g. const decoded = jwt.decode(token);
      // but if not used, no need to store
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <PredictForm />
    </div>
  );
}
