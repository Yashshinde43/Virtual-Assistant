import dotenv from "dotenv";

dotenv.config();
global.GEMINI_KEY = process.env.GEMINI_API_KEY;
  import express from "express";
  import connectDB from "./config/db.js";
  import authRouter from "./routes/auth.route.js";
  import userRouter from "./routes/user.route.js";
  import cookieParser from "cookie-parser";
  import cors from "cors";

  const app = express();
  connectDB();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: "https://ai-virtual-assistant-d4aw.onrender.com",
    credentials: true,
  }));
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);


  const port = process.env.PORT;
  app.listen(port, () => { 
    console.log("Server is running on port " + port);
  });
