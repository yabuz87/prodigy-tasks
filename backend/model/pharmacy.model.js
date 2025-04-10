import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
 
  certificate: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ['approved', 'not-approved', 'pending'],
    required: true,
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Pharmacy", pharmacySchema);