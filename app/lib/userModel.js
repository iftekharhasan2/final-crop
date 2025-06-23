import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String, required: true },
  coins: { type: Number, default: 1000 } // ✅ Added coins field
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
