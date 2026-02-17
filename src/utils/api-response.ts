import type { Response } from "express";

export const apiResponse = <T>(
  res: Response,
  statusCode = 200,
  message = "Success",
  data: T,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
