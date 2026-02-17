import app from "./app";
import { connectDB } from "./config/db-config";
import { env } from "./config/env-config";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

(async () => {
  try {
    // Start server without waiting for DB
    app.listen(env.port, () => console.log(`server is running on ${env.port}`));
    // Try to connect to DB in background
    connectDB()
      .then(() => console.log("Connected to database"))
      .catch((err) => console.error("Failed to connect to database:", err));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
