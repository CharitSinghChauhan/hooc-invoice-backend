import type { Request, Response } from "express";
import { Project } from "../model/project-model";
import { connectDB } from "../config/db-config";
import { apiResponse } from "../utils/api-response";
import ApiError from "../utils/api-error";

export const createProjectController = async (req: Request, res: Response) => {
  try {
    // Todo zod validation
    const { projectName, date, task, inclusions, amount, installments, gst } =
      req.body;

    await connectDB();

    const project = await Project.create({
      projectName, // should be unique
      date: new Date(date),
      task,
      inclusions,
      amount,
      installments,
      gst: gst || 0,
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

export const getProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) throw new ApiError(404, "Resource ID is required");

    await connectDB();

    const project = await Project.findOne({
      _id: id,
      createdBy: req.user.email,
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return apiResponse(res, 200, "Project fetched successfully", project);
  } catch (error) {
    console.error("Error fetching project:", error);
    // TODO add proper Response
    throw new ApiError(500, "Internal server error");
  }
};

export const updateProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) throw new ApiError(404, "Resource ID is required");

    // zod validation
    const { projectName, date, task, inclusions, amount, installments, gst } =
      req.body;

    await connectDB();

    const project = await Project.findOneAndUpdate(
      { _id: id, createdBy: req.user.email },
      {
        projectName,
        date: new Date(date),
        task,
        inclusions,
        amount,
        installments,
        gst: gst || 0,
      },
      { new: true, runValidators: true },
    );

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return apiResponse(res, 200, "Project updated successfully", project);
  } catch (error) {
    console.error("Error updating project:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await connectDB();

    const project = await Project.findOneAndDelete({
      _id: id,
      createdBy: req.user.email,
    });

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    return apiResponse(res, 200, "Project deleted successfully", null);
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new ApiError(500, "Internal server error");
  }
};
