import express from "express";
import { test } from "../controllers/user.controller.js";
import { updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/userVerify.js";

const router = express.Router();

router.get("/test", test);

//we need to verify the user before updating
router.post("/update/:id", verifyToken, updateUser);

export default router;
