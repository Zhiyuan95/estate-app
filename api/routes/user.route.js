import express from "express";
import {
  getUser,
  getUserListing,
  test,
} from "../controllers/user.controller.js";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/userVerify.js";

const router = express.Router();

router.get("/test", test);

//we need to verify the user before updating
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListing);
router.get("/:id", verifyToken, getUser);

export default router;
