import mongoose from "mongoose";
import { env } from "./env-config";

mongoose.set("bufferCommands", false);

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  if (!env.mongodb_uri) {
    throw new Error("MONGODB_URI not defined");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.mongodb_uri , {
      dbName : "hooc-tech"
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
