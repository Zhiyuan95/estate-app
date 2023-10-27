import express from "express";
import {
  creatListing,
  deleteListing,
  getListings,
  getTheListing,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/userVerify.js";

const router = express.Router();

router.post("/create", verifyToken, creatListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getTheListing);
router.get("/get", getListings);

export default router;
