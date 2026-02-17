import type { Request, Response } from "express";
import { env } from "../config/env-config";
import ApiError from "../utils/api-error";
import axios from "axios";
import QueryString from "qs";
import { connectDB } from "../config/db-config";
import { User, UserRole } from "../model/user-model";
import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/api-response";

export const googleOAuthController = async (req: Request, res: Response) => {
  const { code } = req.query;

  console.log("code", code);

  if (!code) {
    throw new ApiError(400, "Code parameter is required");
  }

  const url = "https://oauth2.googleapis.com/token";

  const values = {
    code,
    client_id: env.google_client_id,
    client_secret: env.google_client_secret,
    redirect_uri: env.redirect_url,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(url, QueryString.stringify(values), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { id_token, access_token } = response.data;

    const { data: userInfo } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    );

    console.log("userInfo", userInfo);

    await connectDB();

    let user = await User.findOne({
      googleId: userInfo.id,
    });

    if (!user) {
      user = await User.create({
        googleId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        role: UserRole.USER,
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
      },
      env.jwt_secret as string,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res.redirect(`${env.origin}`);
  } catch (error) {
    console.error("Google OAuth error:", error);

    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
      console.error("Response headers:", error.response?.headers);
    }

    const message = axios.isAxiosError(error)
      ? (error.response?.data?.error_description as string) || error.message
      : (error as Error).message || "Internal Server Error";

    throw new ApiError(500, `Google OAuth failed: ${message}`);
  }
};

export const getUserController = async (req: Request, res: Response) => {
  const { role, picture, name, email } = req.user;

  console.log(req.user)

  return apiResponse(res, 200, "user info", {
    role,
    picture,
    name,
    email,
  });
};
