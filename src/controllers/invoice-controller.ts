import type { Request, Response } from "express";
import { Invoice } from "../model/invoice-model";
import { connectDB } from "../config/db-config";
import { apiResponse } from "../utils/api-response";
import ApiError from "../utils/api-error";

export const createInvoiceController = async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      issuedDate,
      dueDate,
      from,
      to,
      items,
      totalAmount,
      note,
      paymentDetails,
      signature,
    } = req.body;

    await connectDB();

    const invoice = await Invoice.create({
      projectName,
      issuedDate: new Date(issuedDate),
      dueDate: new Date(dueDate),
      from,
      to,
      items,
      totalAmount,
      note,
      paymentDetails,
      signature,
      createdBy: req.user.email,
    });

    return apiResponse(res, 201, "Invoice created successfully", invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const getInvoicesController = async (req: Request, res: Response) => {
  try {
    await connectDB();

    const invoices = await Invoice.find({ createdBy: req.user.email }).sort({
      createdAt: -1,
    });

    return apiResponse(res, 200, "Invoices fetched successfully", invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const getInvoiceController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) throw new ApiError(404, "Resource ID is required");

    await connectDB();

    const invoice = await Invoice.findOne({
      _id: id,
      createdBy: req.user.email,
    });

    if (!invoice) {
      throw new ApiError(404, "Invoice not found");
    }

    return apiResponse(res, 200, "Invoice fetched successfully", invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const updateInvoiceController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) throw new ApiError(404, "Resource ID is required");

    const {
      projectName,
      issuedDate,
      dueDate,
      from,
      to,
      items,
      totalAmount,
      note,
      paymentDetails,
      signature,
    } = req.body;

    await connectDB();

    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, createdBy: req.user.email },
      {
        projectName,
        issuedDate: new Date(issuedDate),
        dueDate: new Date(dueDate),
        from,
        to,
        items,
        totalAmount,
        note,
        paymentDetails,
        signature,
      },
      { new: true, runValidators: true },
    );

    if (!invoice) {
      throw new ApiError(404, "Invoice not found");
    }

    return apiResponse(res, 200, "Invoice updated successfully", invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw new ApiError(500, "Internal server error");
  }
};

export const deleteInvoiceController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await connectDB();

    const invoice = await Invoice.findOneAndDelete({
      _id: id,
      createdBy: req.user.email,
    });

    if (!invoice) {
      throw new ApiError(404, "Invoice not found");
    }

    return apiResponse(res, 200, "Invoice deleted successfully", null);
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw new ApiError(500, "Internal server error");
  }
};
