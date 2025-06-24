import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String, required: true },
  coins: { type: Number, default: 1000 }, // ✅ Added coins field
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

const PredictInputSchema = new mongoose.Schema(
  {
    input: {
      type: Object,
      required: true,
    },
    prediction: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Avoid redefining the model if already present
export const PredictInput =
  mongoose.models.PredictInput || mongoose.model("PredictInput", PredictInputSchema);