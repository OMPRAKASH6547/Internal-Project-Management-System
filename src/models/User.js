import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "manager", "member"], default: "member" },
  },
  { timestamps: true }
);

const User = mongoose.models.ExpressUser || mongoose.model("ExpressUser", schema);
export default User;
