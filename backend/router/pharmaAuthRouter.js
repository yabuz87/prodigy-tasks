import express from "express";
import { addMed, deleteMed, editMed, login, logout, signup,checkAuth, getMyPosts} from "../controller/pharmacyController.js";
import { statusCheck } from "../middleware/pharmacyStatus.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const pharmaRoute=express.Router();
pharmaRoute.post("/signup",signup);
pharmaRoute.post("/login",login);
pharmaRoute.get("/getMyposts",protectRoute,getMyPosts);
pharmaRoute.post("/addMed",protectRoute,statusCheck,addMed);
pharmaRoute.delete("/deleteMed/:id",protectRoute,statusCheck,deleteMed);
pharmaRoute.post("/logout",logout);
pharmaRoute.get("/check",protectRoute,statusCheck,checkAuth);
pharmaRoute.put("/editMed/:id",protectRoute,statusCheck,editMed);


export default pharmaRoute;