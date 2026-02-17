import mongoose, { Schema } from "mongoose";

export interface IProject {
  projectName: string;
  date: Date;
  task: string;
  inclusions: string[];
  amount: number;
  installments: number;
  gst?: number;
  tax?: number;
  createdBy: string;
}

const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    inclusions: {
      type: [String],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    installments: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Project = mongoose.model("Project", projectSchema);
