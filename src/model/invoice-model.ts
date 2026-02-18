import mongoose, { Schema } from "mongoose";

export interface IInvoiceItem {
  id: string;
  task: string;
  inclusion: string;
  amount: number;
  installment: number;
  gst: number;
  total: number;
}

export interface IInvoiceFrom {
  name: string;
  address: string;
  email: string;
  website?: string;
}

export interface IInvoiceTo {
  name: string;
  address: string;
  email: string;
  website?: string;
}

export interface IPaymentDetails {
  paymentLink: string;
}

export interface IInvoice {
  projectName: string;
  issuedDate: Date;
  dueDate: Date;
  from: IInvoiceFrom;
  to: IInvoiceTo;
  items: IInvoiceItem[];
  totalAmount: number;
  note?: string;
  paymentDetails: IPaymentDetails;
  signature?: string;
  createdBy: string;
}

const invoiceItemSchema = new Schema<IInvoiceItem>(
  {
    id: { type: String, required: true },
    task: { type: String, required: true },
    inclusion: { type: String, required: true },
    amount: { type: Number, required: true },
    installment: { type: Number, required: true },
    gst: { type: Number, required: true },
    total: { type: Number, required: true },
  },
  { _id: false },
);

const invoiceFromSchema = new Schema<IInvoiceFrom>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
  },
  { _id: false },
);

const invoiceToSchema = new Schema<IInvoiceTo>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String },
  },
  { _id: false },
);

const paymentDetailsSchema = new Schema<IPaymentDetails>(
  {
    paymentLink: { type: String, required: false },
  },
  { _id: false },
);

const invoiceSchema = new Schema<IInvoice>(
  {
    projectName: {
      type: String,
      required: true,
    },
    issuedDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    from: {
      type: invoiceFromSchema,
      required: true,
    },
    to: {
      type: invoiceToSchema,
      required: true,
    },
    items: {
      type: [invoiceItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    paymentDetails: {
      type: paymentDetailsSchema,
      required: true,
    },
    signature: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Index for faster queries
invoiceSchema.index({ createdBy: 1, createdAt: -1 });

export const Invoice = mongoose.model("Invoice", invoiceSchema);
