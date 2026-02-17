import type { Request, Response } from "express";
import { Project } from "../model/project-model";
import { connectDB } from "../config/db-config";
import { apiResponse } from "../utils/api-response";
import ApiError from "../utils/api-error";

export const createProjectController = async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      date,
      task,
      inclusions,
      amount,
      installments,
      gst,
      tax,
    } = req.body;

    await connectDB();

    const project = await Project.create({
      projectName,
      date: new Date(date),
      task,
      inclusions,
      amount,
      installments,
      gst: gst || 0,
      tax: tax || 0,
      createdBy: req.user.email,
    });

    return apiResponse(res, 201, "Project created successfully", project);
  } catch (error) {
    console.error("Error creating project:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const getProjectsController = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const projects = await Project.find({ createdBy: req.user.email }).sort({
      createdAt: -1,
    });

    return apiResponse(res, 200, "Projects fetched successfully", projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new ApiError(500, "Internal server error");
  }
};
