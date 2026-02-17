import mongoose, { Schema } from "mongoose";
import { env } from "../config/env-config";
import type { NextFunction } from "express";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  SUPER_ADMIN = "super-admin",
}

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    picture: {
      type: String,
    },
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", function (next) {
  const adminEmail = env.admin_email;

  if (this.email === adminEmail) {
    this.role = UserRole.ADMIN;
  }

  next;
});

export const User = mongoose.model("User", userSchema);
