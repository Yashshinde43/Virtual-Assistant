import express from "express";
import { aiAssistant, getCurrentUser, getHistory, updateUser } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";


const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.post("/update", isAuth, upload.single("assistantImage"), updateUser);
userRouter.post("/asktoai", isAuth, aiAssistant);
userRouter.get("/history", isAuth, getHistory);


export default userRouter;  