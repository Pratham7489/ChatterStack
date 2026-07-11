import {Router} from "express";
import { 
    getUserById, 
    loginUser, 
    logoutUser, 
    profileUser, 
    registerUser, 
    updateprofile, 
    updateprofileImage,
    deleteAccount
} from "../controllers/user.controllers.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import uploadToCloudinary from "../middleware/cloudinaryUpload.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);

userRouter.get("/profile", authMiddleware , profileUser);
userRouter.get("/:id", authMiddleware , getUserById);
userRouter.put("/update", authMiddleware , updateprofile);
userRouter.post(
    "/update", 
    authMiddleware , 
    uploadToCloudinary.single("profileImage") , 
    updateprofileImage,
);

userRouter.delete("/delete-account", authMiddleware, deleteAccount);

export default userRouter;