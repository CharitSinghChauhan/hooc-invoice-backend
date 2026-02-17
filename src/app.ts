import express, { type Request, type Response } from "express";
import authRouter from "./routes/auth-route";
import adminRouter from "./routes/admin-route";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env-config";
import errorMiddleware from "./middlewares/error-middleware";

const app = express();

app.use(
  cors({
    origin: env.origin,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log("/ hey i am inside the server");
  res.json("ok");
});

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use(errorMiddleware);

export default app;
