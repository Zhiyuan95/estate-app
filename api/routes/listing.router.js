import express from "express";
import {
  creatListing,
  deleteListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/userVerify.js";

const router = express.Router();

router.post("/create", verifyToken, creatListing);
router.delete("/delete/:id", verifyToken, deleteListing);

export default router;
