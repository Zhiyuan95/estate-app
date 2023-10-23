import express from "express";
import { test } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/userVerify.js";
import { userUpdate } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);

//we need to verify the user before updating
router.post("/update/:id", verifyUser, userUpdate);

export default router;
