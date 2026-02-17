import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api-error";
import jwt from "jsonwebtoken";
import { env } from "../config/env-config";
import { User, UserRole } from "../model/user-model";
import { connectDB } from "../config/db-config";

declare global {
  namespace Express {
    export interface Request {
      user: {
        googleId: string;
        name: string;
        email: string;
        role: UserRole;
        picture?: string | null | undefined;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  console.log("token", token);

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decode = jwt.verify(token, env.jwt_secret as string) as { _id: string };

  await connectDB();
  const user = await User.findById(decode._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized - User not found");
  }

  req.user = user;

  next();
};

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decode = jwt.verify(token, env.jwt_secret as string) as { _id: string };

  await connectDB();
  const user = await User.findById(decode._id);

  if (!user) {
    throw new ApiError(401, "Unauthorized - User not found");
  }

  if (user.role !== UserRole.ADMIN && user.role !== UserRole.SUPER_ADMIN) {
    throw new ApiError(403, "Forbidden - Admin access only");
  }

  req.user = user;

  next();
};
