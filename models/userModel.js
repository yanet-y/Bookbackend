import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: { 
        type: Boolean,
        default: false },
    verificationNumber: {
          type: String, 
        },
  },

  {
    timestamps: true,
  }
);

export const User = mongoose.model("user", userSchema);
