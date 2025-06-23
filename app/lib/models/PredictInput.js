import mongoose from "mongoose";

const predictInputSchema = new mongoose.Schema({
  Zilla: { type: String, required: true },
  Upazila: { type: String, required: true },
  "Union Parishad": { type: String, required: true },
  "Soil Type": { type: String, required: true },
  Season: { type: String, required: true },
  Irrigation: { type: String, required: true },
  Drainage: { type: String, required: true },
  "Insect infestation": { type: String, required: true },
  Diseases: { type: String, required: true },
  "Last Season Crop": { type: String, required: true },
  Area: { type: Number, required: true },
  prediction_text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const PredictInput =
  mongoose.models.PredictInput || mongoose.model("PredictInput", predictInputSchema);
